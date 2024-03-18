function isPlural(word: string): boolean {
  return word.endsWith("s") || word.endsWith("es");
}

export function pluralize(word: string): string {
  if (isPlural(word)) {
    return word;
  }

  if (
    !word.endsWith("ss") &&
    !word.endsWith("x") &&
    !word.endsWith("ch") &&
    !word.endsWith("sh")
  ) {
    if (word.endsWith("y") && !isVowel(word[word.length - 2])) {
      return word.slice(0, -1) + "ies";
    } else if (
      word.endsWith("o") &&
      (word.length <= 2 || word[word.length - 2] !== "o")
    ) {
      return word + "s";
    } else if (word.endsWith("fe")) {
      return word.slice(0, -2) + "ves";
    } else if (word.endsWith("f")) {
      return word.slice(0, -1) + "ves";
    } else if (word.endsWith("ff")) {
      return word + "s";
    } else {
      return word + "s";
    }
  }
  return word + "es";
}

function isVowel(char: string): boolean {
  return ["a", "e", "i", "o", "u"].includes(char.toLowerCase());
}
