var FUNDS = 10000000;
var DAYNUMBER;
var STOCKNUMBER = 10;
var RUNTIMES;
var DELTA;
var COMPANYNUMBER;
var company_name = [];
var s_company = [];
var data;


$(function () {
    countFunds();
});

function STOCK() {
    this.data = [];
    this.investment_number = [];
    this.company_name = "",
        this.totalMoney = [];
    this.fs = [];
    this.locate = [];
    this.dMoney = 0;
    this.myMoney = 0;
    this.counter = 0;
    this.mx = 0;
    this.my = 1;
    this.m = 0;
    this.daily_risk = 0;
    this.trend = 0;
    this.day = 0;
    this.Y = 0;
    this.y_line = [];
    this.Y_line = function() {
        this.Y = this.m * this.day + FUNDS;
        this.y_line.push(this.Y);
    };
    this.init = function() {
        for (var j = 0; j < this.counter; j++) {
            this.fs[j] = [];
        }
        for (var j = 0; j < DAYNUMBER; j++) {
            this.totalMoney[j] = 0;
        }
    }
};
function countTrend(stock) {
    for (var j = 0; j < stock.length; j++) {
        if (stock[j].counter != 0) {
            stock[j].dMoney = Math.floor(FUNDS / stock[j].counter);
            stock[j].myMoney += FUNDS % stock[j].counter;
        }
        for (var k = 0; k < stock[j].counter; k++) {
            stock[j].investment_number[k] = Math.floor(stock[j].dMoney / parseFloat(data[1][s_company[stock[j].locate[k]]]));
            stock[j].myMoney += stock[j].dMoney - (stock[j].investment_number[k] * parseFloat(data[1][s_company[stock[j].locate[k]]]));
            stock[j].fs[k][0] = stock[j].investment_number[k] * parseFloat(data[1][s_company[stock[j].locate[k]]]);
        }
        stock[j].totalMoney[0] = FUNDS;
    }
    for (var j = 0; j < DAYNUMBER - 1; j++) {
        for (var k = 0; k < stock.length; k++) {
            for (var h = 0; h < stock[k].counter; h++) {
                stock[k].totalMoney[j + 1] += stock[k].investment_number[h] * parseFloat(data[j + 2][s_company[stock[k].locate[h]]]);
                stock[k].fs[h][j + 1] = stock[k].investment_number[h] * parseFloat(data[j + 2][s_company[stock[k].locate[h]]]);
            }
            stock[k].totalMoney[j + 1] += stock[k].myMoney;
            stock[k].mx += (j + 2) * (stock[k].totalMoney[j + 1] - FUNDS);
            stock[k].my += (j + 2) * (j + 2);
        }
    }
    for (var j = 0; j < stock.length; j++) {
        if (stock[j].counter != 0) {
            stock[j].m = stock[j].mx / stock[j].my;
        }
        for (var k = 0; k < DAYNUMBER; k++) {
            stock[j].day = k + 1;
            stock[j].Y_line();
            stock[j].daily_risk += (stock[j].totalMoney[k] - stock[j].Y) * (stock[j].totalMoney[k] - stock[j].Y);
        }
        stock[j].daily_risk = Math.sqrt(stock[j].daily_risk / DAYNUMBER);
        if (stock[j].m < 0) {
            stock[j].trend = stock[j].m * stock[j].daily_risk;
        } else {
            stock[j].trend = stock[j].m / stock[j].daily_risk;
        }
    }
    return stock;
}
function countFunds() {
    DELTA = 0.0004;
    RUNTIMES = 10000;
    var c = 30;
    s_company = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    COMPANYNUMBER = c;
    d3.csv("data.csv", function (d) {
        data = d;
        DAYNUMBER = data.length - 1;

        var stock = [];

        for (var j = 0; j < COMPANYNUMBER; j++) {
            company_name[j] = data[0][s_company[j]];
        }
        for (var j = 0; j < COMPANYNUMBER; j++) {
            stock[j] = new STOCK();
            for (var k = 0; k < COMPANYNUMBER; k++) {
                if (k != j) {
                    stock[j].data[k] = 0;
                } else {
                    if (stock[j].counter != 0) {
                        stock[j].company_name += ", ";
                    }
                    stock[j].data[k] = 1;
                    stock[j].company_name += company_name[k];
                    stock[j].locate[stock[j].counter] = k;
                    stock[j].counter++;
                }
            }
            stock[j].init();
        }
        stock = countTrend(stock);
        var best_answer = new STOCK();
        var worst_answer = new STOCK();
        best_answer.trend = 0;
        for (var j = 0; j < COMPANYNUMBER; j++) {
            best_answer.data[j] = 0;
        }
        worst_answer.trend = 10000;

        var change_number = [];
        for (var j = 0; j < COMPANYNUMBER; j++) {
            change_number[j] = 0.5;
        }

        for (var i = 0; i < RUNTIMES; i++) {
            for (var j = 0; j < COMPANYNUMBER; j++) {
                change_number[j] = Math.floor(change_number[j] * 1000) / 1000;
            }
            var r_stock = [];
            for (var j = 0; j < STOCKNUMBER; j++) {
                r_stock[j] = new STOCK();
                for (var k = 0; k < DAYNUMBER; k++) {
                    r_stock[j].totalMoney[k] = 0;
                }
                for (var k = 0; k < COMPANYNUMBER; k++) {
                    var r = Math.random();

                    if (r > change_number[k]) {
                        r_stock[j].data[k] = 0;
                    } else {
                        r_stock[j].data[k] = 1;
                        if (r_stock[j].counter != 0) {
                            r_stock[j].company_name += ", ";
                        }
                        r_stock[j].company_name += company_name[k];
                        r_stock[j].locate[r_stock[j].counter] = k;
                        r_stock[j].counter++;
                    }
                }
                r_stock[j].init();
            }

            r_stock = countTrend(r_stock);
            var good_answer = r_stock[0];
            var bad_answer = r_stock[r_stock.length - 1];
            for (var j = 0; j < STOCKNUMBER; j++) {
                if (good_answer.trend < r_stock[j].trend) {
                    good_answer = r_stock[j];
                } else if (bad_answer > r_stock[j].trend) {
                    bad_answer = r_stock[j];
                }
            }
            if (best_answer.trend < good_answer.trend) {
                best_answer = good_answer;
                console.log("i=", i);
                console.log(best_answer.counter);
                console.log(best_answer.trend);
            }

            if (worst_answer.trend > bad_answer.trend) {
                worst_answer = bad_answer;
            }

            for (var j = 0; j < COMPANYNUMBER; j++) {
                if (best_answer.data[j] > bad_answer.data[j]) {
                    if (change_number[j] < 0.5) {
                        change_number[j] = 1 - change_number[j];
                    }
                    change_number[j] += DELTA;
                } else
                    if (best_answer.data[j] < bad_answer.data[j]) {
                        if (change_number[j] > 0.5) {
                            change_number[j] = 1 - change_number[j];
                        }
                        change_number[j] -= DELTA;
                    }
            }
        }


        console.log(best_answer.counter);
        var best_name = "";
        for (var j = 0; j < best_answer.counter; j++) {
            best_name += company_name[best_answer.locate[j]];
            best_name += ", ";
        }
        var day_label = [];
        for (var j = 0; j < DAYNUMBER; j++) {
            day_label.push("day " + (j + 1));
        }

        //==============draw
        var dataset = [];
        for (var j = 0; j < COMPANYNUMBER; j++) {
            dataset.push({
                label: stock[j].company_name,
                lineTension: 0,
                backgroundColor: getbgcolor(),
                borderColor: getbdcolor(),
                data: stock[j].totalMoney,
                fill: false,
            });
        }

        dataset.push({
            label: "best : " + best_answer.company_name,
            lineTension: 0,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 5,
            data: best_answer.totalMoney,
            fill: false,
        });

        dataset.push({
            label: "趨勢線",
            lineTension: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 5,
            borderDash: [10, 5],
            data: best_answer.y_line,
            fill: false,
        });

        var lineChartData = {
            labels: day_label,
            datasets: dataset,
        }


        var ctx = document.getElementById('myChart');
        var line_chart = new Chart(ctx, {
            type: 'line',
            data: lineChartData,
            options: {
                responsive: true,
                legend: {
                    display: true,
                },
                tooltips: {
                    enabled: true
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true
                    }]
                },
            }
        });

    });
}
function getbgcolor() {
    var numone = parseInt(Math.random() * (255 + 1), 10);
    var numtwo = parseInt(Math.random() * (255 + 1), 10);
    var numthree = parseInt(Math.random() * (255 + 1), 10);

    color = "rgba(" + numone + "," + numtwo + "," + numthree + ",0.2)";
    return color;
}
function getbdcolor() {
    var numone = parseInt(Math.random() * (255 + 1), 10);
    var numtwo = parseInt(Math.random() * (255 + 1), 10);
    var numthree = parseInt(Math.random() * (255 + 1), 10);

    color = "rgba(" + numone + "," + numtwo + "," + numthree + ",0.5)";
    return color;
}