// ASCII art shared by the welcome banner and `neofetch`.

// `mehla.in` in figlet's "small" font
export const LOGO = [
    '            _    _        _',
    '  _ __  ___| |_ | |__ _  (_)_ _',
    " | '  \\/ -_) ' \\| / _` |_| | ' \\",
    ' |_|_|_\\___|_||_|_\\__,_(_)_|_||_|',
];

export const LOGO_WIDTH = Math.max(...LOGO.map((line) => line.length));
