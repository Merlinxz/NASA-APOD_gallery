document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('dateForm');
            const randomImageButton = document.getElementById('randomImage');
            const dateInput = document.getElementById('dateInput');
            const nasaContent = document.getElementById('nasaContent');
            const descriptionModal = new bootstrap.Modal(document.getElementById('descriptionModal'));

            const initDatePicker = () => {
                $('#dateInput').datepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true
                });
            };

            const fetchImage = async(date) => {
                try {
                    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=BzWsuhSOMGcUpRcxE7OkpVBSVeiPtCIpoFJVq7FO&date=${date}`);
                    if (!response.ok) throw new Error('Failed to fetch APOD');
                    const data = await response.json();
                    displayContent(data);
                } catch (error) {
                    console.error('Error:', error);
                    nasaContent.innerHTML = '<p class="text-warning">Failed to fetch data. Please try again later.</p>';
                }
            };

            const displayContent = (data) => {
                    nasaContent.innerHTML = `<div class="col-12" data-aos="fade-up">
            <h2>${data.title}</h2>
            ${data.media_type === 'image' ? `<img src="${data.url}" alt="${data.title}" class="img-fluid">` : `<iframe src="${data.url}" frameborder="0" allowfullscreen class="img-fluid"></iframe>`}
            <button id="showDescription" class="btn btn-outline-light mt-3">Show Description</button>
        </div>`;
        dateInput.value = data.date;
        document.getElementById('modalDescription').innerText = data.explanation;
        AOS.refresh();
    };

    const getRandomDate = () => {
        const start = new Date('1995-06-16');
        const end = new Date();
        const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(randomTime).toISOString().split('T')[0];
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = dateInput.value;
        nasaContent.innerHTML = '<p>Loading...</p>';
        await fetchImage(date);
    });

    randomImageButton.addEventListener('click', async () => {
        const randomDate = getRandomDate();
        await fetchImage(randomDate);
    });

    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'showDescription') {
            descriptionModal.show();
        }
    });

    initDatePicker();
    AOS.init({
        duration: 2500,
        easing: 'ease-in-out-quart',
        once: true,
        mirror: false,
    });
});