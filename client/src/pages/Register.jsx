import { Form, redirect, Link } from 'react-router-dom';
import { FormRow, Logo, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post('/auth/register', data);
    toast.success('Registration successful');
    return redirect('/login');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};
const Register = () => {
  
  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>Register</h4>
        <FormRow type="text" name="name" defaultValue='jhon'/>
        <FormRow type="text" name="lastName" labelText="Last Name" defaultValue='Doe'/>
        <FormRow type="text" name="location" defaultValue='earth'/>
        <FormRow type="email" name="email" defaultValue='jhon@doe.com'/>
        <FormRow type="password" name="password" defaultValue='secret123'/>
        <SubmitBtn formBtn/>
        <p>
          Already a member?
          <Link to='/login' className='member-btn'>
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  )
}

export default Register
