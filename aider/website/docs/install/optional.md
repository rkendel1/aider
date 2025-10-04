---
parent: Installation
nav_order: 20
---

# Optional steps
{: .no_toc }

The steps below are completely optional.

- TOC
{:toc}

## Install git

**Git is now a required dependency for Aider.**
You must have git installed for Aider to function.
Here are
[instructions for installing git in various environments](https://github.com/git-guides/install-git).

After installing Git, you should also install the GitHub CLI for enhanced GitHub integration:

### Install GitHub CLI (gh)

The GitHub CLI enables Aider to provide seamless GitHub account connection and repository management features.

- **macOS**: `brew install gh`
- **Windows**: Download from [GitHub CLI releases](https://github.com/cli/cli/releases) or use `winget install --id GitHub.cli`
- **Linux (Debian/Ubuntu)**: 
  ```bash
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  sudo apt update
  sudo apt install gh
  ```
- **Linux (Fedora/RHEL)**: `sudo dnf install gh`

For other platforms, see the [official GitHub CLI installation guide](https://github.com/cli/cli#installation).

After installation, authenticate with GitHub:
```bash
gh auth login
```

## Setup an API key

You need an key from an API provider to work with most models:

- [OpenAI](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) provides o1, o3-mini, gpt-4o and other models. Note that paying for an API key is different than being a "ChatGPT" subscriber.
- [Anthropic](https://docs.anthropic.com/claude/reference/getting-started-with-the-api) provides Claude 3.7 Sonnet and Haiku.
- [DeepSeek](https://platform.deepseek.com/api_keys) provides DeepSeek R1 and DeepSeek Chat V3.
- [OpenRouter](https://openrouter.ai/keys) allows you to access models from many providers using a single key.

You can [store your api keys in configuration or env files](/docs/config/api-keys.html)
and they will be loaded automatically whenever you run aider.

## Enable Playwright 

Aider supports adding web pages to the chat with the `/web <url>` command.
When you add a url to the chat, aider fetches the page and scrapes its
content.

By default, aider uses the `httpx` library to scrape web pages, but this only
works on a subset of web pages.
Some sites explicitly block requests from tools like httpx.
Others rely heavily on javascript to render the page content,
which isn't possible using only httpx.

Aider works best with all web pages if you install
Playwright's chromium browser and its dependencies:

```
playwright install --with-deps chromium
```

See the
[Playwright for Python documentation](https://playwright.dev/python/docs/browsers#install-system-dependencies)
for additional information.


## Enable voice coding 

Aider supports 
[coding with your voice](https://aider.chat/docs/usage/voice.html)
using the in-chat `/voice` command.
Aider uses the [PortAudio](http://www.portaudio.com) library to
capture audio.
Installing PortAudio is completely optional, but can usually be accomplished like this:

- For Windows, there is no need to install PortAudio.
- For Mac, do `brew install portaudio`
- For Linux, do `sudo apt-get install libportaudio2`
  - Some linux environments may also need `sudo apt install libasound2-plugins`

## Add aider to your IDE/editor

You can use 
[aider's `--watch-files` mode](https://aider.chat/docs/usage/watch.html)
to integrate with any IDE or editor.

There are a number of 3rd party aider plugins for various IDE/editors.
It's not clear how well they are tracking the latest
versions of aider,
so it may be best to just run the latest
aider in a terminal alongside your editor and use `--watch-files`.

### NeoVim

[joshuavial](https://github.com/joshuavial) provided a NeoVim plugin for aider:

[https://github.com/joshuavial/aider.nvim](https://github.com/joshuavial/aider.nvim)

### VS Code

You can run aider inside a VS Code terminal window.
There are a number of 3rd party 
[aider plugins for VSCode](https://marketplace.visualstudio.com/search?term=aider%20-kodu&target=VSCode&category=All%20categories&sortBy=Relevance).

### Other editors

If you are interested in creating an aider plugin for your favorite editor,
please let us know by opening a
[GitHub issue](https://github.com/Aider-AI/aider/issues).


