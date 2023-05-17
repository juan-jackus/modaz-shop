import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';
import { Calendar } from 'react-feather';
import Flatpickr from 'react-flatpickr';
import {
  Area,
  YAxis,
  XAxis,
  Tooltip,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: '7/12',
    ventes: 20,
    clics: 60,
    visites: 100,
  },
  {
    name: '8/12',
    ventes: 40,
    clics: 80,
    visites: 120,
  },
  {
    name: '9/12',
    ventes: 30,
    clics: 70,
    visites: 90,
  },
  {
    name: '10/12',
    ventes: 70,
    clics: 110,
    visites: 170,
  },
  {
    name: '11/12',
    ventes: 40,
    clics: 80,
    visites: 130,
  },
  {
    name: '12/12',
    ventes: 60,
    clics: 80,
    visites: 160,
  },
  {
    name: '13/12',
    ventes: 50,
    clics: 100,
    visites: 140,
  },
  {
    name: '14/12',
    ventes: 140,
    clics: 90,
    visites: 240,
  },
  {
    name: '15/12',
    ventes: 120,
    clics: 180,
    visites: 220,
  },
  {
    name: '16/12',
    ventes: 100,
    clics: 160,
    visites: 180,
  },
  {
    name: '17/12',
    ventes: 140,
    clics: 140,
    visites: 270,
  },
  {
    name: '18/12',
    ventes: 180,
    clics: 200,
    visites: 280,
  },
  {
    name: '19/12',
    ventes: 220,
    clics: 220,
    visites: 375,
  },
];

const CustomTooltip = (data) => {
  if (data.active && data.payload) {
    return (
      <div className='recharts-custom-tooltip'>
        <p className='font-weight-bold mb-0'>{data.label}</p>
        <hr />
        <div className='active'>
          {data.payload.map((i) => {
            return (
              <div className='d-flex align-items-center' key={i.dataKey}>
                <span
                  className='bullet bullet-sm bullet-bordered mr-50'
                  style={{
                    backgroundColor: i.fill,
                  }}
                ></span>
                <span className='align-middle text-capitalize mr-75'>
                  {i.dataKey} : {i.payload[i.dataKey]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

const SimpleAreaChart = ({ primary }) => {
  return (
    <Card>
      <CardHeader className='flex-sm-row flex-column justify-content-sm-between justify-content-center align-items-sm-center align-items-start'>
        <CardTitle tag='h4'>Données du site web</CardTitle>
        <div className='d-flex align-items-center'>
          <Calendar size={15} />
          <Flatpickr
            options={{
              mode: 'range',
              defaultDate: ['2019-05-01', '2019-05-10'],
            }}
            className='form-control flat-picker bg-transparent border-0 shadow-none'
          />
        </div>
      </CardHeader>

      <CardBody>
        <div className='d-flex align-items-center mb-2'>
          <div className='mr-2'>
            <span className='bullet bullet-sm bullet-primary bullet-bordered mr-50'></span>
            <span className='align-middle'>Clics</span>
          </div>
          <div className='mr-2'>
            <span
              className='bullet bullet-sm bullet-bordered mr-50'
              style={{ backgroundColor: 'rgba(115, 103, 240, .5)' }}
            ></span>
            <span className='align-middle mr-75'>Ventes</span>
          </div>
          <div>
            <span
              className='bullet bullet-sm bullet-bordered mr-50'
              style={{ backgroundColor: 'rgba(115, 103, 240, .2)' }}
            ></span>
            <span className='align-middle'>Visites</span>
          </div>
        </div>
        <div className='recharts-wrapper'>
          <ResponsiveContainer>
            <AreaChart height={400} data={data}>
              <CartesianGrid />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip content={CustomTooltip} />
              <Area
                dataKey='ventes'
                stackId='ventes'
                stroke='0'
                fill='rgba(115, 103, 240, .5)'
              />
              <Area
                dataKey='clics'
                stackId='clics'
                stroke='0'
                fill='rgb(115, 103, 240)'
              />
              <Area
                dataKey='visites'
                stackId='visites'
                stroke='0'
                fill='rgba(115, 103, 240, .2)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
export default SimpleAreaChart;
