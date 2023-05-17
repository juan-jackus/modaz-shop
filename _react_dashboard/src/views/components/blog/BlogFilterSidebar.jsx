// ** Utils
import { selectThemeColors2 } from '@utils';
// ** Third Party Components
import Avatar from '@components/avatar';
import classnames from 'classnames';
import Select from 'react-select';
import '@styles/react/libs/react-select/_react-select.scss';
// ** Styling Components
import * as Icon from 'react-feather';
import {
  Card,
  Button,
  CardBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from 'reactstrap';

const BlogFilterSidebar = (props) => {
  // props
  const {
    status,
    showTrash,
    setStatus,
    remountKey,
    categories,
    sidebarOpen,
    sortByValue,
    setCategories,
    setRemountKey,
    setSortByValue,
    setCurrentPage,
    postCategories,
  } = props;

  const sortByOptions = {
    newest: 'Newest',
    oldest: 'Oldest',
    mostReaded: 'Most Readed',
    leastReaded: 'Least Readed',
  };
  const trashSortByOptions = {
    trash_desc: 'Recently Deleted',
    trash_asc: 'Oldest Deleted',
  };
  const postStatus = [
    { value: true, label: 'Published' },
    { value: false, label: 'Drafted' },
  ];
  const selectedStatus = postStatus.find((st) => st.value === status);
  const selectedSortOption = showTrash ? trashSortByOptions : sortByOptions;

  // ** Categorie Select Handler
  const categoriesFilterHandler = (e) => {
    let categoriesArray = categories;
    const value = e.currentTarget.value;
    const checked = e.currentTarget.checked;
    if (checked && !categoriesArray.includes(value)) {
      categoriesArray.push(value);
    } else {
      // eslint-disable-next-line
      categoriesArray = categoriesArray.filter((c) => c != value);
    }
    setCategories([...categoriesArray]);
    setCurrentPage(1);
  };
  // ** Render Post Categories
  const renderCategories = () => {
    return postCategories.map((category, index) => {
      const IconTag = Icon[category.icon];

      return (
        <div key={index} className='blog-category-filter'>
          <label>
            <input
              type='checkbox'
              value={category.value}
              defaultChecked={categories.includes(category.value.toString())}
              onChange={categoriesFilterHandler}
            />
            <Avatar
              className='rounded mr-75'
              color={category.color}
              icon={<IconTag size={15} />}
            />
            <span>{category.label}</span>
          </label>
        </div>
      );
    });
  };
  // ** Render Sorting dropdown Text
  const renderSortByOptions = () => {
    return Object.keys(selectedSortOption).map((option, i) => {
      if (option === sortByValue) return null;
      return (
        <DropdownItem
          key={i}
          className='w-100'
          onClick={() => setSortByValue(option)}
        >
          {selectedSortOption[option]}
        </DropdownItem>
      );
    });
  };
  // ** Reset Filter
  const resetFilterHandler = () => {
    setStatus('');
    setCategories([]);
    setCurrentPage(1);
    setSortByValue('newest');
    setRemountKey(Date.now());
  };

  return (
    <div className='sidebar-detached sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('sidebar-shop', {
            show: sidebarOpen,
          })}
        >
          <Card key={remountKey}>
            <h5 className='text-center mt-3 mb-0'>Filters</h5>
            <CardBody>
              {/* POST STATUS */}
              <div className='mb-2'>
                <h6 className='section-label'>STATUS</h6>
                <Select
                  classNamePrefix='select'
                  placeholder='...'
                  isClearable={true}
                  options={postStatus}
                  theme={selectThemeColors2}
                  defaultValue={selectedStatus}
                  onChange={(option) => setStatus(option?.value)}
                />
              </div>
              {/* SORT POST */}
              <div className='mb-2'>
                <h6 className='section-label'>SORT BY</h6>
                <UncontrolledButtonDropdown className=''>
                  <DropdownToggle
                    className='text-capitalize mr-1'
                    color='secondary'
                    outline
                    caret
                  >
                    {selectedSortOption[sortByValue]}
                  </DropdownToggle>
                  <DropdownMenu>{renderSortByOptions()}</DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
              {/* POST CATEGORIES */}
              <div className='mb-2'>
                <div className='blog-categories '>
                  <h6 className='section-label'>Categories</h6>
                  <div className='mt-1'>{renderCategories()} </div>
                </div>
              </div>
              {/* RESET BUTTON */}
              <Button.Ripple
                className='w-100 '
                color='secondary'
                onClick={resetFilterHandler}
              >
                Reset Filter
              </Button.Ripple>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogFilterSidebar;
