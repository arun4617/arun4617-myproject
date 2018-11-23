import { Component, OnInit } from '@angular/core';
import { CookieService } from '../../../node_modules/ngx-cookie-service';
import { SearchService } from '../services/search.service';
import { setting } from '../settings';

declare var $: any;
@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
  metricsTable:boolean;
  weeklyDataSet:any=[];
  aggregateDataSet:any=[];
  nextWeekEnable:boolean;
  nextWeekDisable:boolean;
  prevWeekEnable:boolean;
  prevWeekDisable:boolean;
  lastWeek:any;
  popUpmessage:string;
  weeklyRatingSum:number;
  weeklyQuerySum:number;
  weeklyDownloadSum:number;
  aggregateRatingSum:number;
  aggregateTotalQuerySum:number;
  aggregateUniqueQuerySum:number;
  aggregateDownloadSum:number;
  uniqueQuerySum:number;
  weeklyStats:boolean;
  useremail:any;

  constructor(private cookieService: CookieService, private searchService: SearchService) { 
    this.metricsTable = false;
    this.startDay=-7;
    this.endDay=0;
    this.weeklyStats = false;
    this.getUsageDetails(this.startDay,this.endDay, true);
    this.nextWeekEnable = true;
    this.nextWeekDisable = false;
    this.prevWeekEnable = true;
    this.prevWeekDisable = false;
    $("#showErrorModalDialog").modal('hide');
    this.useremail = setting.UserEmail;
  }

  ngOnInit() {}

  getUsageDetails(startDay, endDay, status){
    this.weeklyDataSet = [];
    this.aggregateDataSet = [];
    this.lastWeek = "Weekly stats starting "+ -(this.startDay) +" days back";
    var name, downloadStatus, queryUniqueStatus, queryTotalStatus, ratingStatus, aggregateDownloadStatus, aggregateQueryStatus, aggregateRatingStatus, aggregateUniqueQueryStatus;
    this.weeklyQuerySum = this.weeklyRatingSum = this.weeklyDownloadSum = 0;
    this.aggregateUniqueQuerySum = this.aggregateTotalQuerySum = this.aggregateRatingSum = this.aggregateDownloadSum = this.uniqueQuerySum= 0;
    this.searchService.getUsageDetails(startDay, endDay)
      .subscribe(userDetails => {
        for(var i=0; i < userDetails.results.length; i++){
          name = userDetails.results[i].first_name;
          if(name == ""){
            name = userDetails.results[i].email;
            if (name.indexOf('@prezentium.com') > -1)
            {
              name = name.split('@')[0];
            }
          } 
          ratingStatus = userDetails.results[i].ratingStats.dateRangeRatings.TotalRatingsMade;
          if(ratingStatus == null){
            ratingStatus=0;
          }
          queryUniqueStatus = userDetails.results[i].queryStats.dateRangeQueries.DistinctQueriesMade;
          if(queryUniqueStatus == null){
            queryUniqueStatus=0;
          }
          queryTotalStatus = userDetails.results[i].queryStats.dateRangeQueries.TotalQueriesMade;
          if(queryTotalStatus == null){
            queryTotalStatus=0;
          }
          downloadStatus = userDetails.results[i].downloadStats.dateRangeDownloads.TotalDownloadsMade;
          if(downloadStatus == null){
            downloadStatus=0;
          }
          aggregateRatingStatus = userDetails.results[i].ratingStats.totalRatings.TotalRatingsMade;
          if(aggregateRatingStatus == null){
            aggregateRatingStatus=0;
          }
          aggregateQueryStatus = userDetails.results[i].queryStats.totalQueries.TotalQueriesMade;
          if(aggregateQueryStatus == null){
            aggregateQueryStatus=0;
          }
          aggregateUniqueQueryStatus = userDetails.results[i].queryStats.totalQueries.DistinctQueriesMade;
          if(aggregateUniqueQueryStatus == null){
            aggregateUniqueQueryStatus=0;
          }
          aggregateDownloadStatus = userDetails.results[i].downloadStats.totalResults.TotalDownloadsMade;
          if(aggregateDownloadStatus == null){
            aggregateDownloadStatus=0;
          }
          this.weeklyRatingSum += ratingStatus;
          this.weeklyQuerySum += queryTotalStatus;
          this.weeklyDownloadSum += downloadStatus;
          this.aggregateRatingSum += aggregateRatingStatus;
          this.uniqueQuerySum += queryUniqueStatus;
          this.aggregateUniqueQuerySum += aggregateUniqueQueryStatus;
          this.aggregateTotalQuerySum += aggregateQueryStatus;
          this.aggregateDownloadSum += aggregateDownloadStatus;
          if(status == true){
            this.weeklyDataSet.push({"name":name, "rating":ratingStatus, "download":downloadStatus, "totalquery":queryTotalStatus, "distinctquery": queryUniqueStatus});
            this.aggregateDataSet.push({"name":name, "rating":aggregateRatingStatus, "totalquery":aggregateQueryStatus,"distinctquery":aggregateUniqueQueryStatus, "download":aggregateDownloadStatus});
          }else{
            this.weeklyDataSet = [];
            this.aggregateDataSet = [];
            $('#weeklyTable').dataTable().fnAddData([
              name, 
              queryTotalStatus,
              queryUniqueStatus,
              downloadStatus,
              ratingStatus
            ]);
            $('#aggregateTable').dataTable().fnAddData([
              name, 
              aggregateQueryStatus,
              aggregateUniqueQueryStatus,
              aggregateDownloadStatus,
              aggregateRatingStatus
            ]);
          }          
        }   
        this.weeklyStats = true;
        if(status == true){
          this.displayTable();
        }
        this.prevWeekEnable = true;
        this.prevWeekDisable = false;
        if(this.startDay  >= 0 || this.endDay == 0){
          this.nextWeekEnable = false;
          this.nextWeekDisable = true;
        }else{
          this.nextWeekEnable = true;
          this.nextWeekDisable = false;
        }
        this.metricsTable = true;
    },
    (err)=>{
        $("#showErrorModalDialog").modal('show');
        this.popUpmessage = err;
        this.weeklyStats = false;
    });
  }
  
  displayTable(){
    setTimeout(() => {
      $('#aggregateTable').DataTable({
        responsive: true,
        bPaginate: false,
        bFilter: false,
        bInfo: false,
        order: [[ 1, "desc" ]]
      });

      $('#weeklyTable').DataTable({
        responsive: true,
        bPaginate: false,
        bFilter: false,
        bInfo: false,
        order: [[ 1, "desc" ]]
      });
    }, 200);
  }

  startDay:number;
  endDay:number;
  prevWeek(){
    this.metricsTable = false;
    this.prevWeekEnable = false;
    this.prevWeekDisable = true;
    var weeklyTable = $('#weeklyTable').DataTable();
    weeklyTable.clear();
    var aggregateTable = $('#aggregateTable').DataTable();
    aggregateTable.clear();
    this.startDay-=7;
    this.endDay-=7;
    this.getUsageDetails(this.startDay,this.endDay, false);
    this.nextWeekEnable = true;
    this.nextWeekDisable = false;
    this.metricsTable = true;
  }
  nextWeek(){
    this.metricsTable = false;
    this.nextWeekEnable = false;
    this.nextWeekDisable = true;
    var weeklyTable = $('#weeklyTable').DataTable();
    weeklyTable.clear();
    var aggregateTable = $('#aggregateTable').DataTable();
    aggregateTable.clear();
    this.startDay+=7;
    this.endDay+=7;
    this.getUsageDetails(this.startDay,this.endDay, false);
    this.metricsTable = true;
  }
}
