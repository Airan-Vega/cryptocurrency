import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { uid } from 'uid';

@Component({
  selector: 'app-modal-portfolio',
  templateUrl: './modal-portfolio.component.html',
  styleUrls: ['./modal-portfolio.component.scss'],
})
export class ModalPortfolioComponent implements OnInit {
  @Input() title: any;
  @Input() data: any;

  public form: FormGroup = new FormGroup({
    id: new FormControl(uid(), Validators.required),
    name: new FormControl(null, Validators.required),
  });

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    if (this.data) {
      this.form = new FormGroup({
        id: new FormControl(this.data.id, Validators.required),
        name: new FormControl(this.data.name, Validators.required),
      });
    }
  }

  save() {
    let { id, name } = this.form.value;
    name = name[0].toUpperCase() + name.substring(1);
    this.modal.close({ id, name });
  }
}
