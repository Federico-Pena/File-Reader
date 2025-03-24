import nspell from "nspell";
import dicEs from "dictionary-es";
function correctTextPages(textPages) {
  return new Promise((resolve, reject) => {
    try {
      const spell = nspell(dicEs.aff.toString(), dicEs.dic.toString());
      const correctedPages = textPages.map(({ text, page }) => {
        const words = text.split(" ");
        const correctedText = words.map((word) => spell.correct(word) ? word : spell.suggest(word)[0] || word).join(" ");
        return { text: correctedText, page };
      });
      resolve(correctedPages);
    } catch (error) {
      reject(error);
    }
  });
}
export {
  correctTextPages
};
