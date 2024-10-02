document.querySelectorAll('.box').forEach(function(branch) {
        branch.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Hide all content sections
            document.querySelectorAll('.branch-content').forEach(function(content) {
                content.style.display = 'none';
            });

            // Show the clicked section
            var target = this.getAttribute('data-target');
            var content = document.getElementById(target);
            if (content) {
                content.style.display = 'block';
                content.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });