// Every terminal command, in `help` order. To add one, create a file in
// commands/ (see docs/content-guide.md) and add it here.
import help from './commands/help.js';
import ls from './commands/ls.js';
import cd from './commands/cd.js';
import pwd from './commands/pwd.js';
import cat from './commands/cat.js';
import open from './commands/open.js';
import whoami from './commands/whoami.js';
import contact from './commands/contact.js';
import theme from './commands/theme.js';
import neofetch from './commands/neofetch.js';
import history from './commands/history.js';
import clear from './commands/clear.js';
import exit from './commands/exit.js';
import eggs from './commands/eggs.js';

export default [help, ls, cd, pwd, cat, open, whoami, contact, theme, neofetch, history, clear, exit, ...eggs];
