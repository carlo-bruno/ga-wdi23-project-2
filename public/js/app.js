console.log("js connected");

function queryRhymes(query) {
  let url = `https://api.datamuse.com/words?rel_rhy=${query}`;

  fetch(url, {
    method: "GET",
    mode: "cors"
  })
    .then(response => {
      // console.log(response);
      return response.json();
    })
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
        let label = document.createElement("h5");
        label.textContent = groups[key].label;
        div.appendChild(label);

        // create div with spans
        let words = document.createElement("div");
        groups[key].words.forEach((word, i) => {
          let span = document.createElement("span");
          // no comma on last word
          span.textContent =
            groups[key].words.length - 1 === i
              ? word.word
              : `${word.word}, `;
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

document.addEventListener("DOMContentLoaded", () => {
  const rhymeSearch = document.getElementById("rhymeSearch");
  const rhymeInput = document.getElementById("rhymeInput");

  rhymeSearch.addEventListener("submit", e => {
    e.preventDefault();
    let query = rhymeInput.value;
    if (query.length > 0) {
      queryRhymes(query);
    }
  });
});
