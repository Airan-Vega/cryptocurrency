import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { uid } from 'uid';

@Component({
  selector: 'app-modal-coins',
  templateUrl: './modal-coins.component.html',
})
export class ModalCoinsComponent implements OnInit {
  @Input() title: any;
  @Input() data: any;

  public form: FormGroup = new FormGroup({
    id: new FormControl(uid(), Validators.required),
    acronym: new FormControl(null, [Validators.required]),
    name: new FormControl(null, Validators.required),
  });

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    if (this.data) {
      this.form = new FormGroup({
        id: new FormControl(this.data.id, Validators.required),
        acronym: new FormControl(this.data.acronym, [Validators.required]),
        name: new FormControl(this.data.name, Validators.required),
      });
    }
  }

  save() {
    let { id, acronym, name } = this.form.value;

    acronym = acronym.toUpperCase();
    name = name[0].toUpperCase() + name.substring(1).toLowerCase();
    this.modal.close({ id, acronym, name });
  }
}
