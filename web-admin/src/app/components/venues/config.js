const title = "Venues";

const labels = [
	{
		id: "id",
		label: "id",
	},
	{
		id: "branch_id",
		label: "Branch",
	},
	{
		id: "number",
		label: "Venue No.",
	},
	{
		id: "title_en",
		label: "English Title",
	},
	{
		id: "title_hk",
		label: "Chinese Title (traditional)",
	},
	{
		id: "title_cn",
		label: "Chinese Title (simplified)",
	},
	{
		id: "opening_time",
		label: "Opening Time",
	},
	{
		id: "closing_time",
		label: "Closing Time",
	},
	{
		id: "created_at",
		label: "Created At",
	},
	{
		id: "updated_at",
		label: "updated At",
	},
];

const ignoreKeys = ["created_at", "updated_at", "id"];

export { labels, title, ignoreKeys };
