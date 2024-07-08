const createChart = (ctx, data, title) => {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [{
                label: 'Rata-Rata Nilai',
                data: data,
                backgroundColor: 'blue',
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

window.onload = () => {
    const ctx3 = document.getElementById('chart3').getContext('2d');
    createChart(ctx3, [78, 70, 95, 62], 'Grafik Nilai Siswa Kelas IX');
};
