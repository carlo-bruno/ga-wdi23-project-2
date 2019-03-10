console.log("app.js connected");

function queryRhymes(query) {
  let url = `https://api.datamuse.com/words?rel_rhy=${query}`;

  fetch(url, {
    method: "GET",
    mode: "cors"
  })
    .then(response => response.json())
    .then(data => {
      // group data by syllable count
      let groups = [
        { label: "1 Syllable", words: [] },
        { label: "2 Syllables", words: [] },
        { label: "3 Syllables", words: [] },
        { label: "4 Syllables", words: [] },
        { label: "5 Syllables", words: [] },
        { label: "6 Syllables", words: [] }
      ];

      data.forEach(word => {
        if (word.numSyllables < 7)
          groups[word.numSyllables - 1].words.push(word);
      });

      // filter out empty syllable group
      groups = groups.filter(group => {
        return group.words.length > 0;
      });
      return groups;
    })
    .then(groups => {
      //render to page
      let results = document.getElementById("rhymeResult");
      results.textContent = !!groups.length
        ? ""
        : "Sorry, no rhymes found";

      // create container
      for (let key in groups) {
        let div = document.createElement("div");
        let label = document.createElement("h4");
        label.textContent = `${groups[key].label} (${groups[key].words.length})`;
        label.classList.add("type-font")
        div.appendChild(label);

        // create div with spans
        let words = document.createElement("div");
        words.classList.add('words');
        groups[key].words.forEach((word, i) => {
          let span = document.createElement("span");
          // no comma on last word
          span.textContent =
            groups[key].words.length - 1 === i
              ? word.word
              : `${word.word}, `;
          // strong matches
          if (word.score > 100) {
            span.classList.add("strong");
          }
          words.appendChild(span);
        });

        div.appendChild(words);
        results.appendChild(div);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function querySynonyms(query) {
  // let url = `https://api.datamuse.com/words?rel_syn=${query}`;
  let url = `https://api.datamuse.com/words?ml=${query}`;

  fetch(url, {
    method: "GET",
    mode: "cors"
  })
    .then(response => response.json())
    .then(data => {
      // console.log(data[0]);
      // group by categories
      let groups = [
        { label: "Nouns", words: [] },
        { label: "Adjectives", words: [] },
        { label: "Verbs", words: [] },
        { label: "Adverbs", words: [] }
      ];

      data.forEach(word => {
        // debugger;
        switch (true) {
          case !word.tags:
            break;
          case word.tags.includes("n"):
            groups[0].words.push(word);
            break;
          case word.tags.includes("adj"):
            groups[1].words.push(word);
            break;
          case word.tags.includes("v"):
            groups[2].words.push(word);
            break;
          case word.tags.includes("adv"):
            groups[3].words.push(word);
            break;
          default:
            break;
        }
      });
      groups = groups.filter(group => {
        return group.words.length > 0;
      });
      return groups;
    })
    .then(groups => {
      console.log(groups);
      let results = document.getElementById("synonymResult");
      results.textContent = !!groups.length
        ? ""
        : "Sorry, no synonyms found";

      // create container
      for (let key in groups) {
        let div = document.createElement("div");
        let label = document.createElement("h4");
        label.textContent = `${groups[key].label} (${groups[key].words.length})`;
        label.classList.add("type-font")
        div.appendChild(label);

        // create div with spans
        let words = document.createElement("div");
        words.classList.add('words');
        groups[key].words.forEach((word, i) => {
          let span = document.createElement("span");
          // no comma on last word
          span.textContent =
            groups[key].words.length - 1 === i
              ? word.word
              : `${word.word}, `;
          // strong matches
          if (word.tags.includes("syn")) {
            span.classList.add("strong");
          }
          words.appendChild(span);
        });

        div.appendChild(words);
        results.appendChild(div);
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const rhymeSearch = document.getElementById("rhymeSearch");
  const rhymeInput = document.getElementById("rhymeInput");

  const synonymSearch = document.getElementById("synonymSearch");
  const synonymInput = document.getElementById("synonymInput");

  rhymeSearch.addEventListener("submit", e => {
    e.preventDefault();
    let query = rhymeInput.value;
    if (query.length > 0) {
      queryRhymes(query);
    }
  });

  synonymSearch.addEventListener("submit", e => {
    e.preventDefault();
    let query = synonymInput.value;
    if (query.length > 0) {
      querySynonyms(query);
    }
  });
});
