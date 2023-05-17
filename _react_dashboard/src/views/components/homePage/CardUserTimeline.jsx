import Avatar from '@components/avatar';
import Timeline from '@components/timeline';
import AvatarGroup from '@components/avatar-group';
import { List, MoreVertical } from 'react-feather';
import jsonImg from '@src/assets/images/icons/json.png';
import ceo from '@src/assets/images/portrait/small/avatar-s-9.jpg';
import { Card, CardHeader, CardTitle, CardBody, Media } from 'reactstrap';

// const avatarGroupArr = [
//   {
//     title: 'Billy Hopkins',
//     img: require('@src/assets/images/portrait/small/avatar-s-9.jpg').default,
//     placement: 'bottom',
//     imgHeight: 33,
//     imgWidth: 33,
//   },
//   {
//     title: 'Amy Carson',
//     img: require('@src/assets/images/portrait/small/avatar-s-6.jpg').default,
//     placement: 'bottom',
//     imgHeight: 33,
//     imgWidth: 33,
//   },
//   {
//     title: 'Brandon Miles',
//     img: require('@src/assets/images/portrait/small/avatar-s-8.jpg').default,
//     placement: 'bottom',
//     imgHeight: 33,
//     imgWidth: 33,
//   },
//   {
//     title: 'Daisy Weber',
//     img: require('@src/assets/images/portrait/small/avatar-s-7.jpg').default,
//     placement: 'bottom',
//     imgHeight: 33,
//     imgWidth: 33,
//   },
//   {
//     title: 'Jenny Looper',
//     img: require('@src/assets/images/portrait/small/avatar-s-20.jpg').default,
//     placement: 'bottom',
//     imgHeight: 33,
//     imgWidth: 33,
//   },
// ];

const data = [
  {
    title: '12 factures ont été payées',
    content: "Les factures ont été payées à l'entreprise.",
    meta: 'Il y a 12 minutes',
    metaClassName: 'mr-1',
    customContent: (
      <Media>
        <img className='mr-1' src={jsonImg} alt='data.json' height='23' />
        <Media className='mb-0' body>
          data.json
        </Media>
      </Media>
    ),
  },
  {
    title: 'Réunion des clients',
    content: 'Réunion de projet avec Juan à 10h15.',
    meta: 'Il y a 45 minutes',
    metaClassName: 'mr-1',
    color: 'warning',
    customContent: (
      <Media className='align-items-center'>
        {/* <Avatar img={ceo} /> */}
        <Media className='ml-50' body>
          <h6 className='mb-0'>John Doe (Client)</h6>
          <span>PDG d'Infibeam</span>
        </Media>
      </Media>
    ),
  },
  {
    title: 'Créer un nouveau projet pour un client',
    content: 'Ajouter des fichiers à un nouveau dossier de dessin ou modèle',
    color: 'info',
    meta: 'Il y a 2 jours',
    metaClassName: 'mr-1',
    // customContent: <AvatarGroup data={avatarGroupArr} />,
  },
  {
    title: 'Créer un nouveau projet pour un client',
    content: 'Ajouter des fichiers à un nouveau dossier de dessin ou modèle',
    color: 'danger',
    meta: 'Il y a 5 jours',
    metaClassName: 'mr-1',
  },
];

const UserTimeline = () => {
  return (
    <Card className='card-user-timeline'>
      <CardHeader>
        <div className='d-flex align-items-center'>
          <List className='user-timeline-title-icon' />
          <CardTitle tag='h4'>Chronologie de l'utilisateur</CardTitle>
        </div>
        <MoreVertical size={18} className='cursor-pointer' />
      </CardHeader>
      <CardBody>
        <Timeline className='ml-50 mb-0' data={data} />
      </CardBody>
    </Card>
  );
};

export default UserTimeline;
