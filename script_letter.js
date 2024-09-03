        var blogUrl = "https://bosquejoscortos.com/feeds/posts/summary";
        var tagsSet = new Set(); 
        var nextPageLink = blogUrl + "?alt=json-in-script&max-results=150"; 
        var filterLetter = document.getElementById('filter-data').getAttribute('data-letter');

        document.getElementById('filter-letter').textContent = filterLetter;

        function loadTags(url) {
            var script = document.createElement('script');
            script.src = url + "&callback=handleTagsResponse";
            document.body.appendChild(script);
        }

        function handleTagsResponse(data) {
            var entries = data.feed.entry || [];

            entries.forEach(function(entry) {
                if (entry.category) {
                    entry.category.forEach(function(cat) {
                        if (cat.term[0].toUpperCase() === filterLetter.toUpperCase()) {
                            tagsSet.add(cat.term);
                        }
                    });
                }
            });

            var linkRelNext = data.feed.link.find(function(link) {
                return link.rel === "next";
            });

            if (linkRelNext) {
                nextPageLink = linkRelNext.href + "&alt=json-in-script";
                loadTags(nextPageLink);
            } else {
                var tagsList = document.getElementById('tags-list');
                Array.from(tagsSet).sort().forEach(function(tag) {
                    var li = document.createElement('li');
                    li.innerHTML = '<a href="results.html?tag=' + encodeURIComponent(tag) + '" target="_blank">' + tag + '</a>';
                    tagsList.appendChild(li);
                });
            }
        }

        loadTags(nextPageLink);
    
