// Output lines. Commands return arrays of these; terminal.js renders them as
// text (never HTML). A line is either a string or one of:
//   { text, style }          style is one of STYLES
//   { text, href, newTab }   a link

export const STYLES = ['heading', 'muted', 'error', 'echo'];

export const heading = (text) => ({ text, style: 'heading' });
export const muted = (text) => ({ text, style: 'muted' });
export const error = (text) => ({ text, style: 'error' });
export const link = (text, href, newTab = false) => ({ text, href, newTab });

export const DATA_ERROR = error("couldn't load site data. Try refreshing the page.");
