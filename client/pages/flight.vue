<template>
	<div class="container">
		<!-- Filter by Year -->
		<div class="filter">
			<label for="year">Filter by Year:</label>
			<select id="year" v-model="selectedYear" @change="filterLaunchesByYear">
				<option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
			</select>
		</div>

		<!-- Sorting buttons -->
		<div class="sort-buttons">
			<button @click="sortByDate('asc')">Sort by Date Ascending</button>
			<button @click="sortByDate('desc')">Sort by Date Descending</button>
		</div>

		<RouterLink to="/favorite">Favorite Item</RouterLink>

		<!-- Launches list -->
		<div v-for="item in filteredLaunches" :key="item.id" class="launch-card">
			<!-- Launch details -->
			<div class="txt">
				<h2>Mission Name:</h2>
				<p>{{ item.mission_name }}</p>
			</div>
			<div class="txt">
				<h2>Launch Date:</h2>
				<p>{{ item.launch_date_local }}</p>
			</div>
			<div class="txt">
				<h2 v-if="item.launch_site">Launch Site:</h2>
				<p v-if="item.launch_site">{{ item.launch_site }}</p>
			</div>
			<div class="txt">
				<h2>Rocket Name:</h2>
				<p>{{ item.rocket.rocket_name }}</p>
			</div>
			<div class="txt">
				<h2 v-if="item.details">Details:</h2>
				<p v-if="item.details">{{ item.details }}</p>
			</div>

			<!-- Favorite button -->
			<button :class="{ favorite: isFavorite(item.id) }" @click="toggleFavorite(item)">
				{{ isFavorite(item.id) ? 'Remove from Favorites' : 'Add to Favorites' }}
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
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

const storeLaunch = useLaunchStore()

const launches = ref(data?.value?.launches ?? [])
console.log('Launchessssssssssss:', launches)

const sortedLaunches = ref([...launches.value])

const sortBy = ref<'asc' | 'desc'>('asc')

function sortByDate(order: 'asc' | 'desc') {
	sortBy.value = order
	sortedLaunches.value.sort((a, b) => {
		const dateA = new Date(a.launch_date_local)
		const dateB = new Date(b.launch_date_local)
		return order === 'asc' ? dateA - dateB : dateB - dateA
	})
}

const availableYears = computed(() => {
	const years = new Set<String>()
	launches.value.forEach((launch) => {
		const year = new Date(launch.launch_date_local).getFullYear().toString()
		years.add(year)
	})
	return Array.from(years)
})

const selectedYear = ref<String | null>(null)

const filteredLaunches = computed(() => {
	if (!selectedYear.value) return sortedLaunches.value
	return sortedLaunches.value.filter((launch) => {
		return new Date(launch.launch_date_local).getFullYear().toString() === selectedYear.value
	})
})

const favoriteLaunches = ref<String[]>([])

console.log('Favvvv:', favoriteLaunches.value) // getting value in the array

// const showFavoriteLaunches = ref(false);

function toggleFavorite(item) {
	const index = favoriteLaunches.value.indexOf(item.id)
	if (index === -1) {
		favoriteLaunches.value.push(item.id)
	} else {
		favoriteLaunches.value.splice(index, 1)
	}
	storeLaunch.favorites = favoriteLaunches
	console.log('Favvvv:', favoriteLaunches.value)
}

function isFavorite(id) {
	return favoriteLaunches.value.includes(id)
}

// function toggleShowFavoriteLaunches() {
//     showFavoriteLaunches.value = !showFavoriteLaunches.value;
// }
</script>

<style>
.container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}

.filter {
	margin-bottom: 20px;
}

.sort-buttons {
	margin-bottom: 20px;
}

.sort-buttons button {
	margin-right: 10px;
}

.launch-card {
	background-color: #f5f5f5;
	padding: 15px;
	margin-bottom: 20px;
	border-radius: 5px;
}

.favorite {
	background-color: yellow;
}

.favorite-launches {
	margin-top: 20px;
}

.favorite-launch {
	background-color: #f9f9f9;
	padding: 10px;
	margin-bottom: 10px;
	border-radius: 5px;
}

.txt {
	display: flex;
}

.txt h2 {
	font-size: 18px;
}

.txt p {
	font-size: 16px;
	line-height: 1.5;
}
</style>
