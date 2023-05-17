// ** React
import { useState, useContext, useEffect } from 'react';
// ** Redux Store and Actions
import { useDispatch, useSelector } from 'react-redux';
import { getHomepageData, getPostsStats } from '@store/actions/homepage';
// ** Third Party Components
// ** Utils
import { ThemeColors } from '@src/utility/context/ThemeColors';
// ** Custom Components
import StatsCard from './components/homePage/StatsCard.jsx';
import OrdersPieChart from './components/homePage/OrdersPieChart.jsx';
import CardUserTimeline from './components/homePage/CardUserTimeline.jsx';
import WebsiteDataChart from './components/homePage/WebsiteDataChart.jsx';
import CardCongratulations from './components/homePage/CongratulationsCard.jsx';
// ** Styling Components
import { Row, Col, Spinner } from 'reactstrap';
import '@styles/react/libs/charts/recharts.scss';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import '@styles/react/libs/charts/apex-charts.scss';
import '@styles/base/pages/dashboard-ecommerce.scss';

const HomePage = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const { orderStatusCount, stats, postsStats } = useSelector(
    (state) => state.homepage
  );
  const { statusOptions } = useSelector((state) => state.orders);
  const loggedUser = useSelector((state) => state.auth.userData);
  // ** States
  const { colors } = useContext(ThemeColors);
  const [loader, setLoader] = useState(false);
  const userRole = loggedUser.role.toLowerCase();
  const roleGroup = ['author', 'editor'];
  const includeRole = roleGroup.includes(userRole);

  useEffect(async () => {
    setLoader(true);
    if (!includeRole) {
      await dispatch(getHomepageData());
      return setLoader(false);
    }
    await dispatch(getPostsStats());
    setLoader(false);
  }, [dispatch]);

  return (
    <div id='dashboard-ecommerce ' className='container'>
      <Row className='match-height'>
        <Col sm='12' md={includeRole ? '12' : '4'}>
          <CardCongratulations />
        </Col>
        {!includeRole && (
          <Col sm='12' md='8'>
            <StatsCard
              stats={stats}
              loader={loader}
              includeRole={includeRole}
            />
          </Col>
        )}
      </Row>
      <Row>
        <Col sm='12'>
          <Row className='match-height'>
            <Col sm='12' md='6'>
              <CardUserTimeline />
            </Col>

            <Col sm='12' md='6'>
              {loader ? (
                <div className=' p-5 d-flex justify-content-center '>
                  <Spinner id='datable-loader' />
                </div>
              ) : !includeRole ? (
                <OrdersPieChart
                  statusOptions={statusOptions}
                  orderStatusCount={orderStatusCount}
                />
              ) : (
                <StatsCard
                  stats={postsStats}
                  loader={loader}
                  includeRole={includeRole}
                />
              )}
            </Col>
          </Row>
        </Col>
        {!includeRole && (
          <Col sm='12'>
            <WebsiteDataChart primary={colors.primary.main} />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default HomePage;
