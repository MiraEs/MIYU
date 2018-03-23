import styles from '../lib/styles';
import React from 'react';
import ExNavigationBarBackButton from '../components/ExNavigationBarBackButton';
import helpers from '../lib/helpers';

const renderLeft = helpers.isIOS() ? () => <ExNavigationBarBackButton tintColor={styles.colors.primary} /> : null;

export const navigationBarLight = {
	visible: true,
	backgroundColor: styles.colors.white,
	tintColor: styles.colors.grey20,
	titleStyle: [styles.elements.navigationBarTitle, styles.elements.navigationBarTitleLight],
	borderBottomWidth: 1,
	borderBottomColor: styles.colors.grey,
	renderLeft,
};

export const navigationBarDark = {
	visible: true,
	backgroundColor: styles.colors.secondary,
	tintColor: styles.colors.greyLight,
	titleStyle: [styles.elements.navigationBarTitle, styles.elements.navigationBarTitleDark],
	renderLeft,
};
