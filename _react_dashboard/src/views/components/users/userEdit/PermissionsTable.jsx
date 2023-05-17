import { Lock } from 'react-feather';
import { Table, CustomInput } from 'reactstrap';

function PermissionsTable() {
  return (
    <div className='permissions border mt-1'>
      <h6 className='py-1 mx-1 mb-0 font-medium-2'>
        <Lock size={18} className='mr-25' />
        <span className='align-middle'>Permissions</span>
      </h6>
      <Table borderless striped responsive>
        <thead className='thead-light'>
          <tr>
            <th>Module</th>
            <th>Read</th>
            <th>Write</th>
            <th>Create</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {/* Super Admin */}
          <tr>
            <td>Super Admin</td>
            <td>
              <CustomInput
                type='checkbox'
                id='super-admin-1'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='super-admin-2'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='super-admin-3'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='super-admin-4'
                label=''
                defaultChecked
                disabled
              />
            </td>
          </tr>
          {/* Admin */}
          <tr>
            <td>Admin</td>
            <td>
              <CustomInput
                type='checkbox'
                id='admin-1'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='admin-2'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='admin-3'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='admin-4'
                label=''
                defaultChecked
                disabled
              />
            </td>
          </tr>
          {/* Maintainer */}
          <tr>
            <td>Maintainer</td>
            <td>
              <CustomInput
                type='checkbox'
                id='staff-1'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='staff-2'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='staff-3'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='staff-4'
                label=''
                defaultChecked
                disabled
              />
            </td>
          </tr>
          {/* Editor */}
          <tr>
            <td>Editor</td>
            <td>
              <CustomInput
                type='checkbox'
                id='contributor-1'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='contributor-2'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='contributor-3'
                label=''
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='contributor-4'
                label=''
                disabled
              />
            </td>
          </tr>
          {/* Author */}
          <tr>
            <td>Author</td>
            <td>
              <CustomInput
                type='checkbox'
                id='author-1'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput
                type='checkbox'
                id='author-2'
                label=''
                defaultChecked
                disabled
              />
            </td>
            <td>
              <CustomInput type='checkbox' id='author-3' label='' disabled />
            </td>
            <td>
              <CustomInput type='checkbox' id='author-4' label='' disabled />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default PermissionsTable;
