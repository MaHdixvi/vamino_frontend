import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Import FormsModule if using ngModel
import { LoginComponent } from './login'; // Consider renaming to LoginComponent
import { AuthService } from '../../services';
describe('Login', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent], // Declare the component here
      imports: [FormsModule], // Add FormsModule if using two-way data binding (ngModel)
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Check if the component is created successfully
  });
  it('should bind username and password to input fields', () => {
    const compiled = fixture.nativeElement;
    const usernameInput = compiled.querySelector('input[name="username"]');
    const passwordInput = compiled.querySelector('input[name="password"]');

    usernameInput.value = 'testUser';
    passwordInput.value = 'testPassword';

    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.username).toBe('testUser');
    expect(component.password).toBe('testPassword');
  });
  it('should call login method on form submission', () => {
    spyOn(component, 'login'); // Spy on the login method
    const compiled = fixture.nativeElement;
    const form = compiled.querySelector('form');

    form.dispatchEvent(new Event('submit')); // Simulate form submission
    fixture.detectChanges();

    expect(component.login).toHaveBeenCalled(); // Ensure login method was called
  });
});
