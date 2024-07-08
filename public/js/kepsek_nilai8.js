const createChart = (ctx, data, title) => {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [{
                label: 'Rata-Rata Nilai',
                data: data,
                backgroundColor: 'red',
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
    const ctx2 = document.getElementById('chart2').getContext('2d');
    createChart(ctx2, [88, 70, 90, 75], 'Grafik Nilai Siswa Kelas VIII');
};
