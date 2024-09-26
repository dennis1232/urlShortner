const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const encodeBase62 = (num: number): string => {
    let encoded = '';
    while (num > 0) {
        encoded = chars[num % 62] + encoded;
        num = Math.floor(num / 62);
    }
    return encoded;
};

export const decodeBase62 = (shortUrl: string): number => {
    return shortUrl.split('').reduce((acc, char) => acc * 62 + chars.indexOf(char), 0);
};
