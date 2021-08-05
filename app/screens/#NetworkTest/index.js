import React from 'react';
import {Text} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

const Index = (props) => {
  const netInfo = useNetInfo();
  console.log(netInfo);
  return (
    <>
      <Text>
        {netInfo.details === null
          ? 'false'
          : netInfo.details.ipAddress === undefined ||
            netInfo.details.ipAddress === null
          ? 'false'
          : 'true'}
      </Text>
    </>
  );
};

export default Index;
