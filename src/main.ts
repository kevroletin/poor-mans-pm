import { getFrontMatterInfo, App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab } from "./settings";

// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    console.log("*** ONLOAD ***");

    await this.loadSettings();

    // This adds an editor command that can perform some operation on the current editor instance
    this.addCommand({
      id: 'replace-selected',
      name: 'Replace selected content',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const sel = editor.getSelection().trim();
        if (sel === "" || sel.contains("\n")) {
          console.log("Bad file name");
          return;
        }

        // Get front matter from current file
        const currentFileContent = view.file ? await this.app.vault.read(view.file) : "";
        const frontMatterInfo = getFrontMatterInfo(currentFileContent);
        
        const dir = view.file?.parent?.path ?? "/";
        const new_file = (dir == "/" ? `todo> ${sel}.md` : `${dir}/todo> ${sel}.md`);
        
        // Create content with front matter if it exists
        let newFileContent = "";
        if (frontMatterInfo && Object.keys(frontMatterInfo).length > 0) {
          newFileContent = "---\n";
          for (const [key, value] of Object.entries(frontMatterInfo)) {
            newFileContent += `${key}: ${value}\n`;
          }
          newFileContent += "---\n\n";
        }

        this.app.vault.create(new_file, newFileContent).then((file) => {
          // Replace the selection in the original file with a link to the new file
          const link = this.app.fileManager.generateMarkdownLink(file, view.file?.path ?? "");
          editor.replaceSelection(link);

          console.log(`Created new file: ${new_file}`);
        }).catch((error) => {
          console.error("Error creating file:", error);
          new Notice(`Failed to create file: ${error.message}`);
        });

        console.log(`*** ${new_file} ***`)
      }
    });
  }

  onunload() {
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MyPluginSettings>);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

