import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';

const renderItem = ({ item }: { item: any }) => (
  <View style={styles.item}>
    <Image source={{ uri: item.photo }} style={styles.profileImage} />
    <View style={styles.info}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.address}>
        {item.address}, {item.state}, {item.country}, {item.zip}
      </Text>
      <Text style={styles.phone}>{item.phone}</Text>
    </View>
  </View>
);

const List = () => {
  const { t } = useTranslation();
  const { data: users, isLoading, error } = useQuery('users', () =>
    fetch('http://fake-json-api.mock.beeceptor.com/users').then(res => res.json())
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1254" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('error-fetching-data')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.photo }} style={styles.profileImage} />
            <View style={styles.info}>
              <Text style={styles.name}>{t('name')}: {item.name}</Text>
              <Text style={styles.username}>{t('username')}: {item.username}</Text>
              <Text style={styles.email}>{t('email')}: {item.email}</Text>
              <Text style={styles.company}>{t('company')}: {item.company}</Text>
              <Text style={styles.address}>
                {t('address')}: {item.address}, {item.state}, {item.country}, {item.zip}
              </Text>
              <Text style={styles.phone}>{t('phone')}: {item.phone}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  item: {
    flexDirection: 'row',
    marginVertical: 12,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 0.5,
  },
  profileImage: {
    width: 130,
    height: 170,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    paddingTop: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    marginLeft: 30,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginLeft: 30,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginLeft: 30,
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginLeft: 30,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginLeft: 30,
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginLeft: 30,
  },
  stars: {
    fontSize: 25,
    color: '#3EB489',
    marginLeft: 30,
    paddingTop: 5,
  },
  border: {
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: 'gray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default List;
