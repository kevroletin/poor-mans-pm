import { getFrontMatterInfo, Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, MyPluginSettings } from "./settings";

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    console.log("Loading plugin: poor-mans-pm");

    // await this.loadSettings();

    this.addCommand({
      id: 'todo-from-selection',
      name: 'Create TODO from selection',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const selection = editor.getSelection().trim();
        const lines = selection.split("\n");
        if (lines.length < 1) {
          console.log("Empty selection");
          return;
        }

        if (view.file === null) {
          return;
        }
        const view_file = view.file

        const head = lines[0];
        const body = lines.slice(1).join("\n");

        // const orig_dir = view.file.parent?.path ?? "/";

        let x = view.file.path;

        if (!x.endsWith(".md")) {
          new Notice(`Not a markdown file`);
          return;
        }
        const new_dir = x.substring(0, x.length - 3);
        const new_file = (new_dir == "/" ? `${head}.md` : `${new_dir}/${head}.md`);

        console.log(`Creating ${new_file}`);

        this.app.vault.read(view.file).then((content) => {
          const parent_link = this.app.fileManager.generateMarkdownLink(view_file, new_file);
          // copy "project" property
          const xs = getFrontMatterInfo(content).frontmatter;
          let new_fronmatter = xs.split("\n").filter((x) => x.startsWith("project:")).join("\n");
          if (new_fronmatter !== "") { new_fronmatter = `\n${new_fronmatter}` }
          const new_file_content = `---${new_fronmatter}
parent: "${parent_link}"
---
#todo
${body}
`;
          this.app.vault.create(new_file, new_file_content).then((file) => {
            const link = this.app.fileManager.generateMarkdownLink(file, view_file.path);
            editor.replaceSelection(link);
          }).catch((error) => {
            console.error("Error creating file:", error);
            new Notice(`Failed to create file: ${error.message}`);
          });
        });
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

