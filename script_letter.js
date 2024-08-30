var blogUrl = "https://www.bosquejoscortos.com/feeds/posts/summary";
        var tagsSet = new Set(); // Usamos un Set para evitar duplicados
        var nextPageLink = blogUrl + "?alt=json-in-script&max-results=150";  // URL inicial con paginación
        
        // Obtener la letra para el filtro desde el atributo data-letter del elemento
        var filterLetter = document.getElementById('filter-data').getAttribute('data-letter');

        function loadTags(url) {
            var script = document.createElement('script');
            script.src = url + "&callback=handleResponse";
            document.body.appendChild(script);
        }

        function handleResponse(data) {
            var entries = data.feed.entry || [];

            entries.forEach(function(entry) {
                if (entry.category) {
                    entry.category.forEach(function(cat) {
                        if (cat.term[0].toUpperCase() === filterLetter.toUpperCase()) { // Filtrar por la letra dinámica
                            tagsSet.add(cat.term);
                        }
                    });
                }
            });

            // Verificar si hay un enlace a la siguiente página
            var linkRelNext = data.feed.link.find(function(link) {
                return link.rel === "next";
            });

            if (linkRelNext) {
                // Si hay un enlace a la siguiente página, continuamos cargando
                nextPageLink = linkRelNext.href + "&alt=json-in-script";
                loadTags(nextPageLink);
            } else {
                // Si no hay más páginas, ordenamos y mostramos las etiquetas
                var tagsList = document.getElementById('tags-list');
                Array.from(tagsSet).sort().forEach(function(tag) {
                    var li = document.createElement('li');
                    li.innerHTML = '<a href="/search/label/' + encodeURIComponent(tag) + '">' + tag + '</a>';
                    tagsList.appendChild(li);
                });
            }
        }

        // Iniciar la carga de etiquetas
        loadTags(nextPageLink);    
