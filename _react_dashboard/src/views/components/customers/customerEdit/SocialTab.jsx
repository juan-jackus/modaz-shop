// ** Third Party Components
import {
  Slack,
  GitHub,
  Codepen,
  Twitter,
  Facebook,
  Instagram,
} from 'react-feather';
import {
  Col,
  Row,
  Form,
  Input,
  Label,
  Button,
  FormGroup,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
} from 'reactstrap';

const UserSocialTab = () => {
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Row>
        {/* Twitter */}
        <Col lg='4' md='6' sm='12'>
          <Label for='twitter'>Twitter</Label>
          <FormGroup tag={InputGroup} className='input-group-merge'>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Twitter size={17} />
              </InputGroupText>
            </InputGroupAddon>
            <Input disabled id='twitter' />
          </FormGroup>
        </Col>
        {/* Facebook */}
        <Col lg='4' md='6' sm='12'>
          <Label for='facebook'>Facebook</Label>
          <FormGroup tag={InputGroup} className='input-group-merge'>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Facebook size={17} />
              </InputGroupText>
            </InputGroupAddon>
            <Input disabled id='facebook' />
          </FormGroup>
        </Col>
        {/* Instagram */}
        <Col lg='4' md='6' sm='12'>
          <Label for='instagram'>Instagram</Label>
          <FormGroup tag={InputGroup} className='input-group-merge'>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Instagram size={17} />
              </InputGroupText>
            </InputGroupAddon>
            <Input disabled id='instagram' placeholder='' />
          </FormGroup>
        </Col>
        {/* Github */}
        <Col lg='4' md='6' sm='12'>
          <Label for='github'>Github</Label>
          <FormGroup tag={InputGroup} className='input-group-merge'>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <GitHub size={17} />
              </InputGroupText>
            </InputGroupAddon>
            <Input disabled id='github' />
          </FormGroup>
        </Col>
        {/* Codepen */}
        <Col lg='4' md='6' sm='12'>
          <Label for='codepen'>Codepen</Label>
          <FormGroup tag={InputGroup} className='input-group-merge'>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Codepen size={17} />
              </InputGroupText>
            </InputGroupAddon>
            <Input disabled id='codepen' />
          </FormGroup>
        </Col>
        {/* Slack */}
        <Col lg='4' md='6' sm='12'>
          <Label for='slack'>Slack</Label>
          <FormGroup tag={InputGroup} className='input-group-merge'>
            <InputGroupAddon addonType='prepend'>
              <InputGroupText>
                <Slack size={17} />
              </InputGroupText>
            </InputGroupAddon>
            <Input disabled id='slack' />
          </FormGroup>
        </Col>
        {/* Buttons */}
        <Col className='d-flex flex-sm-row flex-column mt-2' sm='12'>
          <Button
            disabled
            className='mb-1 mb-sm-0 mr-0 mr-sm-1'
            color='primary'
          >
            Sauvegarder les modifications
          </Button>
          <Button disabled color='secondary' outline>
            Réinitialiser
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default UserSocialTab;
