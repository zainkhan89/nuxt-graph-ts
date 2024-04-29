<template>
	<div>
		<!-- Favorite launches section -->
		<div class="favorite-launches">
			<RouterLink to="/flight">All Items</RouterLink>
			<h2>Your Favorite Launches</h2>
			<div
				v-for="launch in allData"
				:key="launch.id"
				:class="isFavourite(launch) ? 'favorite-launch m-4' : ''"
				style="margin: 1%"
			>
				<div v-if="isFavourite(launch)">
					<div class="txt">
						<h2>Mission Name:</h2>
						<p>{{ launch.mission_name }}</p>
					</div>
					<div class="txt">
						<h2>Launch Date:</h2>
						<p>{{ launch.launch_date_local }}</p>
					</div>
					<div class="txt">
						<h2 v-if="launch.launch_site">Launch Site:</h2>
						<p v-if="launch.launch_site">{{ launch.launch_site }}</p>
					</div>
					<div class="txt">
						<h2>Rocket Name:</h2>
						<p>{{ launch.rocket.rocket_name }}</p>
					</div>
					<div class="txt">
						<h2 v-if="launch.details">Details:</h2>
						<p v-if="launch.details">{{ launch.details }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useLaunchStore } from '#imports'

const query = gql`
	query Launches {
		launches {
			details
			id
			mission_name
			rocket {
				rocket_name
			}
			launch_date_local
			launch_site {
				site_name
			}
		}
	}
`

interface Rocket {
	rocket_name: String
}

interface LaunchSite {
	site_name: String
}

const { data } = useAsyncQuery<{
	launches: {
		details: String
		id: String
		mission_name: String
		rocket: Rocket
		launch_date_local: String
		launch_site: LaunchSite
	}[]
}>(query)

const launches = useLaunchStore()
console.log('Fav Launches:', launches.favorites) // data from store

const launchesData = ref(data?.value?.launches ?? [])
const allData = launchesData.value
console.log('All Data', allData)

const favoriteStore = useLaunchStore()

const isFavourite = (launch) => {
	for (let i = 0; i < favoriteStore.favorites.length; i++) {
		if (favoriteStore.favorites[i] === launch.id) {
			return true
		}
	}
	return false
}
</script>
