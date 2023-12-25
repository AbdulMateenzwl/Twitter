import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import {
	View,
	StyleSheet,
	Text,
	Image,
	TextInput,
	Pressable,
	SafeAreaView,
	ActivityIndicator,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTweet } from '../lib/api/tweets';

const user = {
	id: 'u1',
	username: 'mateen',
	name: 'Abdul Mateen',
	image:
		'https://connect.abdulmateenzwl.com/Images/front%20img%20white%20bg.jpg',
};

export default function NewTweet() {
	const [text, setText] = useState('');
	const router = useRouter();

	const queryClient = useQueryClient();

	const { mutateAsync, isLoading, isError, error } = useMutation({
		mutationFn: createTweet,
		onSuccess: (data) => {
			// queryClient.invalidateQueries({ queryKey: ['tweets'] })
			queryClient.setQueriesData(['tweets'], (existingTweets: any) => {
				return [data, ...existingTweets];
			});
		},
	});

	const onTweetPress = async () => {
		console.warn('Posting the tweet: ', text);

		try {
			await mutateAsync({ content: text });
			setText('');
			router.back();
		} catch (error) {
			console.log('Error :', (error as Error).message);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<View style={styles.container}>
				<View style={styles.buttonContainer}>
					<Link href='../' style={{ fontSize: 18 }}>
						Cancel
					</Link>
					{isLoading && <ActivityIndicator />}
					<Pressable onPress={onTweetPress} style={styles.button}>
						<Text style={styles.buttonText}>Tweet</Text>
					</Pressable>
				</View>

				<View style={styles.inputContainer}>
					<Image src={user.image} style={styles.image} alt='User Image' />
					<TextInput
						value={text}
						onChangeText={setText}
						placeholder="What's happening?"
						multiline
						numberOfLines={5}
						style={{ flex: 1 }}
					/>
				</View>

				{isError && (
					<Text style={{ color: 'red' }}>{(error as Error).message}</Text>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		flex: 1,
	},
	buttonContainer: {
		flexDirection: 'row',
		marginVertical: 10,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	button: {
		backgroundColor: '#1C9BF0',
		padding: 10,
		paddingHorizontal: 20,
		borderRadius: 50,
	},
	buttonText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 16,
	},
	inputContainer: {
		flexDirection: 'row',
	},
	image: {
		width: 50,
		aspectRatio: 1,
		borderRadius: 50,
		marginRight: 10,
	},
});
