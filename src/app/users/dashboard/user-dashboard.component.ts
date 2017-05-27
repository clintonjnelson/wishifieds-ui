import { Component, OnInit } from '@angular/core';
import { ApiDashboardService } from '../../core/api/api-dashboard.service';

// THIS IS REALLY A SHARED COMPONENT< SO IT SHOULD BE IN THE SHARED FOLDER PROBABLY

// PUT THIS INTO A SYYNPOST HELPER OR UTIL OR ENUM!!!
const CHART_COLORS = {
  foursquare: '#f94877'
}


@Component({
  moduleId: module.id,
  selector: 'syynpost-dashboard',
  templateUrl: 'user-dashboard.component.html',
  styleUrls:  ['user-dashboard.component.css']
})


export class UserDashboardComponent implements OnInit {
  // These objects are expanded with a sub-object for each chart & are populated via functions
  chartData:  any;
  dateCounts: any;
  isProcessing: any;
  signInteractions: any;
  signTypesToDisplay: any;

  constructor(private apiDashboardService: ApiDashboardService) {
    if((<any>window).Chart) {
      console.log("SETTING CHART COLORS");
      (<any>window).Chart.defaults.global.defaultFontColor = '#ffffff';
    }
    this.dateCounts = {};
    this.chartData  = {};
    this.isProcessing = {};
    this.isProcessing['userPageViewsChart'] = true;
    this.isProcessing['signsCharts'] = true;
    this.signInteractions = {};   // !!!!MAYBE PUT ALL INTERACTIONS INTO AN OBJECT???? BOTH SIGN & USER FOR LATER USE IF NEEDED?
  }

  ngOnInit() {
    const that = this;
    const userId = window.localStorage.getItem('userId');
    console.log("CALLING API...");
    this.apiDashboardService.getInteractions('getUserPageInteractions')
        .subscribe( interactions => {
          console.log("INTERACTIONS FOR USER PAGE RETURNED ARE: ", interactions);
          if(interactions && interactions.length) {
            this.chartData.userPageViewsChart  = this.buildChart('Visitors to Your Syynpost', '#ffffff');
            this.dateCounts.userPageViewsChart = this.resetDateCountsAndPopulateChartXAxisLabels(interactions, this.chartData.userPageViewsChart);
            this.buildLine(interactions, this.dateCounts.userPageViewsChart, this.chartData.userPageViewsChart);
            this.isProcessing.userPageViewsChart = false;
          }
        },
        error => {
          console.log("ERROR RETURNED FROM USER_PAGE_VIEW INTERACTIONS: ", error.toJson());
        });

    this.apiDashboardService.getInteractions('getSignLinkOffInteractions')
        .subscribe( apiSignInteractions => {
          console.log("SIGN INTERACTIONS FOUND ARE: ", apiSignInteractions);
          if(apiSignInteractions && apiSignInteractions.length) {
            // Set base objects
            that.signTypesToDisplay = [];
            that.signInteractions.signTypes = {};

            // Categorize interactions by interaction type
            apiSignInteractions.forEach(function(interaction) {
              if(that.signInteractions.signTypes[interaction.targetType]) {
                that.signInteractions.signTypes[interaction.targetType].push(interaction);
              }
              else {
                that.signInteractions.signTypes[interaction.targetType] = [interaction];
              }
              console.log("INTERACTION IS: ", interaction);
            });

            // For each sign type found, build the chart
            Object.keys(that.signInteractions.signTypes).forEach(function(signType) {
              // Record each sign type
              that.signTypesToDisplay.push(signType);

              // Set blank objects for use
              that.dateCounts[signType] = {};
              that.isProcessing[signType] = true;

              // Populate chart objects
              that.chartData[signType] = that.buildChart(signType, CHART_COLORS[signType]);  // populate this sign's base chart config
              that.dateCounts[signType] = that.resetDateCountsAndPopulateChartXAxisLabels(that.signInteractions.signTypes[signType], that.chartData[signType]);
              that.buildLine(that.signInteractions.signTypes[signType], that.dateCounts[signType], that.chartData[signType]);
            });

            console.log("BUILT SIGN INTERACTIONS OBJECT IS: ", that.signInteractions);
            console.log("FINAL CHART DATA OBJECT AFTER SIGNS IS: ", that.chartData);
            console.log("FINAL DATE COUNTS OBJECT AFTER SIGNS IS: ", that.dateCounts);
            this.isProcessing.signsCharts = false;
          }
        },
        error => {
          console.log("ERROR RETURNED FROM SIGN INTERACTIONS: ", error.toJson());
        });
  }

  buildChart(lineLabel: string, lineColor: string) {
    let chartData = {};
    // configure & build chart
    chartData['line']    = [{ data: [], label: lineLabel }]; // {[data: <y-points>, label: 'labelname']
    chartData['labels']  = [];
    chartData['options'] = {  responsive: true,
                                legend: {
                                  labels: {
                                    fontColor: lineColor
                                  }
                                },
                                scales: {
                                  xAxes: [{
                                    type: 'time',
                                    time: {
                                      unit: 'day',
                                      displayFormats: {
                                        day: 'YYYY-MM-DD',
                                        max: new Date().toLocaleDateString(),
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
    chartData['type']    = 'line';
    chartData['legend']  = true;
    chartData['colors']  = [{
      backgroundColor: '#d3d3d3',
      borderColor: 'rgba(255,255,255,0)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];
    return chartData;
  }

  buildLine(apiInteractions: any[], dateCounts: any, chartData: any) {
    // Build count object
    apiInteractions.forEach(function(dataPoint) {
      const date = new Date(dataPoint.createdAt).toLocaleDateString();
      dateCounts[date]++;
    });
    // set point counts in same order as labels
    chartData.labels.forEach(function(date) {
      chartData.line[0].data.push(dateCounts[date]);
    });

  }

  // chartDataRef is a passed reference object to modify within here
  resetDateCountsAndPopulateChartXAxisLabels(apiInteractions: any[], chartDataRef: any) {
    let dateCounts = {};
    const startDateStr = new Date(apiInteractions[0].createdAt).toLocaleDateString();
    const stopStr      = new Date().toLocaleDateString();  // through now

    let currDateStr = startDateStr;  // initial value is first date
    while(currDateStr <= stopStr) {
      console.log("DATE IS NOW: ", currDateStr);
      dateCounts[currDateStr] = 0;                                      // set object of all counts
      chartDataRef.labels.push(currDateStr);                               // push in each date for x-axis

      let date    = new Date(currDateStr);
      currDateStr = new Date(date.setDate(date.getDate() + 1)).toLocaleDateString();  // increment
    }
    console.log("BLANK DATE COUNT BUILT: ", dateCounts);
    return dateCounts;
  }



  hovered() {
    console.log("HOVER!");
  }
  clicked() {
    console.log("CLICKED");
  }
}


