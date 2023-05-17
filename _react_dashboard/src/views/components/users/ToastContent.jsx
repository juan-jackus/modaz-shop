// ** React
import { Fragment } from 'react';
// ** Third Party Components
import Avatar from '@components/avatar';
// ** Styling Components
import { Check, AlertCircle } from 'react-feather';

// ** Toast Message Handler
const ToastContent = (toast, showValueToDelete) => {
  let color;
  switch (toast.type) {
    case 'success':
      color = 'success';
      break;
    case 'error':
      color = 'danger';
      break;
    case 'danger':
      color = 'danger';
      break;
    default:
      color = 'warning';
      break;
  }

  return (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar
            size='sm'
            color={color}
            icon={
              toast.type === 'success' ? (
                <Check size={12} />
              ) : (
                <AlertCircle size={12} />
              )
            }
          />
          <div style={{ maxHeight: '350px', overflow: 'auto' }}>
            <h6 className='toast-title font-weight-bold text-center'>
              {toast.text}
            </h6>
            {showValueToDelete && toast.value && showValueToDelete(toast.value)}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ToastContent;
