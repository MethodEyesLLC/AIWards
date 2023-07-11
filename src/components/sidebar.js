import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';

const SidebarMenu = () => {
    return (
      <div className="sidebar">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="awardShowDropdown">
            Award Show
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.keys(templates).map((show) => (
              <Dropdown.Item key={show} eventKey={show}>
                {show}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
  
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="categoryDropdown">
            Category
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.keys(templates[awardShow]).map((cat) => (
              <Dropdown.Item key={cat} eventKey={cat}>
                {cat}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
  
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="entryDropdown">
            Entry
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.keys(templates[awardShow][category]).map((ent) => (
              <Dropdown.Item key={ent} eventKey={ent}>
                {ent}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };
  