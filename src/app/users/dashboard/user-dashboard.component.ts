import { Component, OnInit } from '@angular/core';
import { ApiDashboardService } from '../../core/api/api-dashboard.service';


@Component({
  moduleId: module.id,
  selector: 'sign-time-chart',
  templateUrl: 'user-dashboard.component.html',
  styleUrls:  ['user-dashboard.component.css']
})


export class UserDashboardComponent implements OnInit {
  chartData:  any;
  dateCounts: any;
  isProcessing: boolean = true;

  constructor(private apiDashboardService: ApiDashboardService) {
    if((<any>window).Chart) {
      console.log("SETTING CHART COLORS");
      (<any>window).Chart.defaults.global.defaultFontColor = '#ffffff';
    }
    this.dateCounts = {};
    this.chartData  = {};
  }

  ngOnInit() {
    const that = this;
    const userId = window.localStorage.getItem('userId');
    console.log("CALLING API...");
    this.apiDashboardService.getInteractions('getUserPageInteractions')
        .subscribe( interactions => {
          console.log("INTERACTIONS RETURNED: ", interactions);
          this.setChart();
          this.resetDateCounts(interactions);
          console.log("COUNTS ARE: ", this.dateCounts);
          this.buildLine(interactions);
          this.isProcessing = false;
          console.log("CHART DATA AFTER FORMATTING IS: ", that.chartData);
        },
        error => {
          console.log("ERROR RETURNED FROM INTERACTIONS: ", error.toJson());
        });
  }

  setChart() {
    // Global Configuration
    this.chartData.line    = [{ data: [], label: 'User Views' }]; // {[data: <y-points>, label: 'labelname']
    this.chartData.labels  = [];
    this.chartData.options = {  responsive: true,
                                legend: {
                                  labels: {
                                    fontColor: '#ffffff'
                                  }
                                },
                                scales: {
                                  xAxes: [{
                                    type: 'time',
                                    time: {
                                      unit: 'day',
                                      displayFormats: {
                                        day: 'YYYY-MM-DD',
                                        max: new Date().toISOString().substring(0,10),
                                      }
                                    },
                                    gridLines: {
                                      display: true,
                                      color: '#c0c0c0'
                                    }
                                  }],
                                  yAxes: [{
                                    ticks: {
                                      min: 0,
                                      userCallback: function(tick) {
                                        // Keep only whole number yAxis ticks
                                        if(Math.floor(tick) === tick) { return tick; }
                                      }
                                    },
                                    gridLines: {
                                      display: true,
                                      color: '#C0C0C0'
                                    }
                                  }],
                                }
                              };
    this.chartData.type    = 'line';
    this.chartData.legend  = true;
    this.chartData.colors  = [{
      backgroundColor: '#d3d3d3',
      borderColor: 'rgba(255,255,255,0)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];
  }

  buildLine(apiInteractions) {
    var that = this;
    // let prevDate = '';
    // apiInteractions.forEach(function(dataPoint) {
    //   const date = dataPoint.createdAt.substring(0, 10);
    //   // If exists, increment count by one
    //   if(date === prevDate) {
    //     const countIndex = that.chartData.line[0].data.length - 1;
    //     that.chartData.line[0].data[countIndex]++;  //verify increments
    //   }
    //   else {
    //     that.chartData.labels.push(date);     // add newest label
    //     that.chartData.line[0].data.push(1);  // add newest count
    //     prevDate = date;
    //   }
    // });

    // Build count object
    apiInteractions.forEach(function(dataPoint) {
      const date = dataPoint.createdAt.substring(0, 10);
      that.dateCounts[date]++;
      // dateCounts[date] = (currCount ? currCount++ : 1);
    });
    // set labels in order
    // this.chartData.labels = Object.keys(dateCounts).sort();
    // set point counts in same order as labels
    this.chartData.labels.forEach(function(date) {
      that.chartData.line[0].data.push(that.dateCounts[date]);
    });

  }

  resetDateCounts(apiInteractions) {
    const startDateStr = new Date(apiInteractions[0].createdAt).toISOString().substring(0, 10);
    const endDate      = new Date(apiInteractions[apiInteractions.length - 1]['createdAt']);
    const stopStr      = new Date(endDate.setDate(endDate.getDate() + 1)).toISOString().substring(0, 10); // include end date in while loop

    let currDateStr = startDateStr;  // initial value is first date
    while(currDateStr < stopStr) {
      console.log("DATE IS NOW: ", currDateStr);
      this.dateCounts[currDateStr] = 0;                                      // set object of all counts
      this.chartData.labels.push(currDateStr);                               // push in each date for x-axis

      let date = new Date(currDateStr);
      currDateStr = new Date(date.setDate(date.getDate() + 1)).toISOString().substring(0, 10);  // increment
    }
    console.log("BLANK DATE COUNT BUILT: ", this.dateCounts);
  }



  hovered() {
    console.log("HOVER!");
  }
  clicked() {
    console.log("CLICKED");
  }
}


