// get data from api
let url = "https://api.orhanaydogdu.com.tr/deprem/";

var req = new XMLHttpRequest();
req.open("GET", url, true);
req.responseType = "json";
req.send();

req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
        let res = req.response;
        earthquakes(res);
    }
};

// process incoming data
function earthquakes(res) {
    if (res["status"] == true) {
        let count = 100;
        for (i in res["result"].reverse()) {
            let eq = res["result"][i];

            let table = document.getElementById("list");
            let row = table.insertRow(1);

            row.insertCell(0).innerHTML = count;

            let date = eq["date"].split(" ")
            row.insertCell(1).innerHTML = date[0];
            row.insertCell(2).innerHTML = date[1];

            let coordinates = eq["geojson"]["coordinates"];
            row.insertCell(3).innerHTML = coordinates[1];
            row.insertCell(4).innerHTML = coordinates[0];

            row.insertCell(5).innerHTML = eq["depth"].toFixed(1);

            row.insertCell(6).innerHTML = `<span class="mag">${eq["mag"].toFixed(1)}</span>`;

            row.insertCell(7).innerHTML = eq["title"];

            count--;
        }

        chart(res["result"]);
        last_eq(res);
    } else {
        alert("Veriler alınamadı. Lütfen daha sonra tekrar deneyiniz.");
    }
}

// get lastest and biggest earthquake
function last_eq(res) {
    let eq = res["result"].reduce((prev, curr) => {
        return prev.mag > curr.mag ? prev : curr;
    });

    document.getElementById("last-mag").innerHTML = `<span class="mag">${eq["mag"].toFixed(1)}</span> büyüklüğünde`;
    document.getElementById("last-title").innerHTML = eq["title"];

    // 2023.04.21 tarihinde 08:56:31 saatinde
    let date = eq["date"].split(" ")
    document.getElementById("last-date").innerHTML = `${date[0]} tarihinde ${date[1]} saatinde gerçekleşti.`;
}

// create chart
function chart(res) {
    let last_10_earthquakes = res.reverse().slice(0, 10).reverse();
    let mags = last_10_earthquakes.map((i) => { return i.mag })
    let names = last_10_earthquakes.map((i) => { return i.title })

    new Chart(document.getElementById("chart"), {
        type: "line",
        data: {
            labels: names,
            datasets: [{
                data: mags,
                borderWidth: 1,
                borderColor: "#eb6f92"
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 5,
                        }
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}