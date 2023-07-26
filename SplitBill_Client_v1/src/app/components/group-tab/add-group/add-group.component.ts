import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/dataservice';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent  {
  groupname: string = '';

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  createGroup() {
    if (this.groupname.trim() !== '') {
      this.dataService.post_add_group(this.groupname).subscribe((data: any) => {
        console.log(data);
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
