import React from 'react';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {MaterialIcons} from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

// created all the items values form a python script I wrote
const items = [
  // this is the parent or 'item'
    {
     name: 'Colors',
     id: 1000,
     children: [
      {
        name:'Red',
        id:0
      },
      {
        name:'Green',
        id:1
      },
      {
        name:'Yellow',
        id:2
      },
      {
        name:'Blue',
        id:3
      },
      {
        name:'Orange',
        id:4
      },
      {
        name:'Purple',
        id:5
      },
      {
        name:'Cyan',
        id:6
      },
      {
        name:'Magenta',
        id:7
      },
      {
        name:'Lime',
        id:8
      },
      {
        name:'Pink',
        id:9
      },
      {
        name:'Teal',
        id:10
      },
      {
        name:'Lavender',
        id:11
      },
      {
        name:'Brown',
        id:12
      },
      {
        name:'Beige',
        id:13
      },
      {
        name:'Maroon',
        id:14
      },
      {
        name:'Mint',
        id:15
      },
      {
        name:'Olive',
        id:16
      },
      {
        name:'Apricot',
        id:17
      },
      {
        name:'Navy',
        id:18
      },
      {
        name:'Grey',
        id:19
      },
      {
        name:'White',
        id:20
      },
      {
        name:'Black',
        id:21
      }
    ]
    },
    {
     name: 'Engine Type',
     id: 1001,
     children: [
      {
        name:'V8',
        id:22
      },
      {
        name:'V10',
        id:23
      },
      {
        name:'V12',
        id:24
      },
      {
        name:'Straight Layout',
        id:25
      },
      {
        name:'Inline Layout',
        id:26
      },
      {
        name:'V Layout',
        id:27
      },
      {
        name:'Twin Cylinder',
        id:28
      },
      {
        name:'Three Cylinder',
        id:29
      },
      {
        name:'Four Cylinder',
        id:30
      },
      {
        name:'Five Cylinder',
        id:31
      },
      {
        name:'Six Cylinder',
        id:32
      },
      {
        name:'Eight Cylinder',
        id:33
      }
    ]
    },
    {
     name: 'Seating',
     id: 1002,
     children: [
      {
        name:'Third-row seating',
        id:34
      },
      {
        name:'Lumbar support',
        id:35
      },
      {
        name:'Nylon',
        id:36
      },
      {
        name:'Heated',
        id:37
      },
      {
        name:'Leather',
        id:38
      }
    ]
    },
    {
     name: 'Roof',
     id: 1003,
     children: [
      {
        name:'Sunroof',
        id:39
      },
      {
        name:'Moonroof',
        id:40
      }
    ]
    },
    {
     name: 'Safety Features',
     id: 1004,
     children: [
      {
        name:'Automatic emergency braking (AEB)',
        id:41
      },
      {
        name:'Forward collision warning',
        id:42
      },
      {
        name:'Blind-spot monitoring',
        id:43
      },
      {
        name:'Evasive steering',
        id:44
      },
      {
        name:'Pre-safe nudging',
        id:45
      },
      {
        name:'Lane-keeping assist',
        id:46
      },
      {
        name:'Automatic high beams',
        id:47
      },
      {
        name:'Rear cross-traffic warning',
        id:48
      }
    ]
    }];

export default class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: this.props.selectedItems,
    };
  }
  // updates when the new items get selected
  onSelectedItemsChange = (selectedItems) => {
      this.setState({ selectedItems });
      this.props.updateParent({ selectedItems} );
  };

  // loads the multiselect with the features supplied above
  render() {
    return (
	<View style = {{width:'100%'}}>
        <SectionedMultiSelect
          items={items}
          IconRenderer={MaterialIcons}
          uniqueKey="id"
          subKey="children"
          selectText="Select some features..."
	  searchPlaceholderText = "Search for your desired features"
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={this.state.selectedItems}
	    colors = {{
		primary:'#0095ff'
	    }}
        />
      </View>
    );
  }
}
