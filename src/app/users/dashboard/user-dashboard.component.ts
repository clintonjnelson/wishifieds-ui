import { Component, OnInit } from '@angular/core';
import { ApiDashboardService } from '../../core/api/api-dashboard.service';


@Component({
  moduleId: module.id,
  selector: 'sign-time-chart',
  templateUrl: 'user-dashboard.component.html',
  styleUrls:  ['user-dashboard.component.css']
})


export class UserDashboardComponent implements OnInit {
  line: any;
  chartData: any;
  isProcessing: boolean = true;

  constructor(private apiDashboardService: ApiDashboardService) {
    if((<any>window).Chart) {
      console.log("SETTING CHART COLORS");
      (<any>window).Chart.defaults.global.defaultFontColor = '#ffffff';
    }
    this.chartData = {};
  }

  ngOnInit() {
    const that = this;
    const userId = window.localStorage.getItem('userId');
    console.log("CALLING API...");
    this.apiDashboardService.getInteractions('getUserPageInteractions')
        .subscribe( interactions => {
          console.log("INTERACTIONS RETURNED: ", interactions);
          this.setChart();
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
                                    // type: 'time',
                                    // time: {
                                    //   displayFormat: {
                                    //     day: 'YYYY-MM-DD',
                                    //     max: new Date().toISOString().substring(0,10),
                                    //   }
                                    // },
                                    gridLines: {
                                      display: true,
                                      color: '#C0C0C0'
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
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(255,255,255,0)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];
  }

  buildLine(apiInteractions) {
    var that = this;
    let prevDate = '';
    apiInteractions.forEach(function(dataPoint) {
      const date = dataPoint.createdAt.substring(0, 10);
      // If exists, increment count by one
      if(date === prevDate) {
        const countIndex = that.chartData.line[0].data.length - 1;
        that.chartData.line[0].data[countIndex]++;  //verify increments
      }
      else {
        that.chartData.labels.push(date);     // add newest label
        that.chartData.line[0].data.push(1);  // add newest count
        prevDate = date;
      }
    });

    // dateCounts: {};
    // // Build count object
    // apiDataPointsArr.forEach(function(dataPoint) {
    //   const date       = dataPoint.createdAt.substring(0, 10);
    //   const currCount  = dateCounts[date];

    //   dateCounts[date] = (currCount ? currCount++ : 1);
    // });
    // // set labels in order
    // this.chartData.labels = Object.keys(dateCounts).sort();
    // // set point counts in same order as labels
    // this.chartData.labels.forEach(function(date) {
    //   this.chartData.line[0].data.push(dateCounts[date]);
    // });

    // SINCE MONGO IS SORTED CAN DO THIS:
      // add first label to the labels
      // add label count of one to data
      // record this label for checking
      // move to next label
          // if same as first label, only increment data count
          // if new label, add to labels, add 1 to data
  }



  hovered() {
    console.log("HOVER!");
  }
  clicked() {
    console.log("CLICKED");
  }
}


