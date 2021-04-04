import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public utilityService: UtilityService, private router: Router, private activatedRoute: ActivatedRoute) { }

  filterData = {
    years: [],
    launch: [{
      label: 'True',
      value: true
    }, {
      label: 'False',
      value: false
    }],
    landing: [{
      label: 'True',
      value: true,
      isActive: false
    }, {
      label: 'False',
      value: false,
      isActive: false
    }],
    selected: {
      year: '',
      landing: null,
      launch: null
    }
  }

  ngOnInit(): void {
    this.utilityService.range(2006, 2020).map((item) => {
      this.filterData.years.push({
        label: item.toString(),
        value: item
      })
    });

    if (sessionStorage.getItem('selectedFilters')) {
      let selectedFilters = JSON.parse(sessionStorage.getItem('selectedFilters'));
      if (selectedFilters.launch_year) {
        this.filterData.selected.year = selectedFilters.launch_year
      }
      if (selectedFilters.launch_success) {
        this.filterData.selected.launch = selectedFilters.launch_success
      }
      if (selectedFilters.land_success) {
        this.filterData.selected.landing = selectedFilters.land_success
      }
    }
    this.getData()
  }
  spaceXdata = [];
  isDataLoaded;
  getData() {
    let url = (this.filterData.selected.year != '' ? '&launch_year=' + this.filterData.selected.year : '') + (this.filterData.selected.launch != null ? '&launch_success=' + this.filterData.selected.launch : '') + (this.filterData.selected.landing != null ? '&land_success=' + this.filterData.selected.landing : '');
    let selectedFilters = {
      launch_year: this.filterData.selected.year,
      launch_success: this.filterData.selected.launch,
      land_success: this.filterData.selected.landing
    }
    sessionStorage.setItem('selectedFilters', JSON.stringify(selectedFilters))
    this.isDataLoaded = false;
    this.utilityService.getAPICall('https://api.spacexdata.com/v3/launches?limit=100' + url)
      .subscribe(result => {
        this.spaceXdata = [];
        this.spaceXdata = result;
        if (this.spaceXdata.length > 0) {
          this.isDataLoaded = true;
        } else {
          this.isDataLoaded = null;
        }
      }, error => {
        this.isDataLoaded = null;
      })
  }

  clearFilters(type) {
    if (type == 'years') {
      this.filterData.selected.year = '';
    } else if (type == 'launch') {
      this.filterData.selected.launch = null;
    } else if (type == 'landing') {
      this.filterData.selected.landing = null;
    } else {
      this.filterData.selected = {
        year: '',
        landing: null,
        launch: null
      }
    }
    this.getData()
  }
  applyFilter(type, item) {
    if (type == 'years') {
      this.filterData.selected.year = item.value
    }
    if (type == 'launch') {
      this.filterData.selected.launch = item.value
    }
    if (type == 'landing') {
      this.filterData.selected.landing = item.value
    }
    this.getData()
  }
}