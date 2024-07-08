// Bar chart
const createChart = (ctx, data, title) => {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [{
                label: 'Rata-Rata Nilai',
                data: data,
                backgroundColor: 'orange',
                barThickness: 100,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
};

// Render chart
window.onload = () => {
    const ctx1 = document.getElementById('chart1').getContext('2d');
    createChart(ctx1, [78, 65, 85, 60], 'Grafik Nilai Siswa Kelas VII');
};
