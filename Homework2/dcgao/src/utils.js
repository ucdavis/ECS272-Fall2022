const processTitleData = (data) => {
  // Movie counts of all time
  let countryCounts = {};
  // Movie counts of each year
  let countryAnnualCounts = {};
  // IMDB votes, scores, and TMDB popularity
  let countryStats = [];
  data.forEach((row) => {
    const countries = JSON.parse(row.production_countries.replace(/'/g, '"'));
    countries.forEach((country) => {
      if (country in countryCounts) {
        countryCounts[country]++;
        if (row.imdb_votes != null && row.imdb_score != null && row.tmdb_popularity != null && row.tmdb_score != null && row.release_year != null) {
          countryStats[country].push({
            vote: row.imdb_votes,
            score: row.imdb_score,
            pop: row.tmdb_popularity,
            tmdb_score: row.tmdb_score,
            release_year: row.release_year,
          });
        }
        if (row.release_year in countryAnnualCounts[country]) {
          countryAnnualCounts[country][row.release_year]++;
        } else {
          countryAnnualCounts[country][row.release_year] = 1;
        }
      } else {
        countryCounts[country] = 1;
        countryAnnualCounts[country] = {};
        countryAnnualCounts[country][row.release_year] = 1;
        countryStats[country] = []
        if (row.imdb_votes != null && row.imdb_score != null && row.tmdb_popularity != null && row.tmdb_score != null && row.release_year != null) {
          countryStats[country].push({
            vote: row.imdb_votes,
            score: row.imdb_score,
            pop: row.tmdb_popularity,
            tmdb_score: row.tmdb_score,
            release_year: row.release_year,
          });
        }
      }
    })
  });

  return {
    counts: countryCounts,
    year_counts: countryAnnualCounts,
    stats: countryStats,
  };
}

// Sort by movie counts and select top countries
const selectTitleData = (data, numSelected) => {
  let sortedCountries = Object.keys(data.counts);
  return sortedCountries.sort((a, b) => data.counts[b] - data.counts[a]).slice(0, numSelected);
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array
}

export default {
  processTitleData,
  selectTitleData,
  shuffleArray,
}