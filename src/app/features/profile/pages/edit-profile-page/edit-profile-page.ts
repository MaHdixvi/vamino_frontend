import { Component } from '@angular/core';
import { ProfileEditComponent } from "../../components";

@Component({
  selector: 'app-edit-profile-page',
  imports: [ProfileEditComponent],
  templateUrl: './edit-profile-page.html',
  styleUrl: './edit-profile-page.css',
})
export class EditProfilePage {
  // This component is a container for the ProfileEditComponent.
  // It may contain additional logic in the future, such as page-level title management.
}
