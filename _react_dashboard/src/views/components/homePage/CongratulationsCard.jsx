import Avatar from '@components/avatar';
// ** Styling Components
import { Award } from 'react-feather';
import { Card, CardBody } from 'reactstrap';
import decorationLeft from '@src/assets/images/elements/decore-left.png';
import decorationRight from '@src/assets/images/elements/decore-right.png';

const CardCongratulations = () => {
  return (
    <Card className='card-congratulations'>
      <CardBody className='text-center'>
        <img
          className='congratulations-img-left'
          src={decorationLeft}
          alt='decor-left'
        />
        <img
          className='congratulations-img-right'
          src={decorationRight}
          alt='decor-right'
        />
        <Avatar
          icon={<Award size={28} />}
          className='shadow'
          color='primary'
          size='xl'
        />
        <div className='text-center'>
          <h1 className='mb-1 text-white' style={{ fontSize: '1.3rem' }}>
            Bienvenue sur le tableau de bord de Modaz Shop !
          </h1>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardCongratulations;
