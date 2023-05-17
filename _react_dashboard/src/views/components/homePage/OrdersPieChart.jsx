import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap';
import { PieChart } from 'react-feather';
import Chart from 'react-apexcharts';

const OrdersPieChart = ({ orderStatusCount, statusOptions }) => {
  //Pie Chart Vars
  const pieChartLabels = [];
  const pieChartSeries = [];
  const pieChartColors = [];
  const labels = [];
  const statusColor = {
    proceed: 'text-info',
    shipped: 'text-warning',
    completed: 'text-success',
    cancelled: 'text-danger',
  };

  orderStatusCount.forEach((status, i) => {
    // eslint-disable-next-line
    const foundStatus = statusOptions.find((st) => st.value == status.id);
    if (foundStatus) {
      pieChartLabels[i] = foundStatus.label;
      pieChartSeries[i] = status.count;
      pieChartColors[i] = foundStatus.hex_color;
      labels.push({
        label: foundStatus.label,
        color: statusColor[foundStatus.label.toLowerCase()],
        count: status.count,
      });
    }
  });

  const options = {
    chart: {
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: -50,
      },
    },
    labels: pieChartLabels,
    dataLabels: {
      enabled: true,
    },
    legend: { show: false },
    stroke: {
      width: 3,
    },
    colors: pieChartColors,
  };

  return orderStatusCount.length ? (
    <Card>
      <CardHeader className='align-items-end'>
        <CardTitle tag='h4'>Orders Status</CardTitle>
      </CardHeader>
      <CardBody>
        <Chart
          options={options}
          series={pieChartSeries}
          type='pie'
          height={325}
        />
        <div className='d-flex flex-wrap justify-content-center pt-25'>
          {labels.map((st, i) => (
            <div key={i} className='d-flex mx-25 my-25 border rounded p-50'>
              <div className='d-flex align-items-center'>
                <PieChart size={15} className={st.color} />
                <span className='font-weight-bold text-capitalize ml-75 mr-50'>
                  {st.label}
                </span>
              </div>
              : <span className='ml-50'> {st.count}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  ) : null;
};
export default OrdersPieChart;
