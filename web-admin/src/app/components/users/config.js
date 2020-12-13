const title = "Users";

const labels = [
	{
		id: "id",
		label: "id",
	},
	{
		id: "name",
		label: "CNA",
	},
	{
		id: "email",
		label: "Email",
	},
	{
		id: "",
		label: "Chinese Title (simplified)",
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

const ignoreKeys = ["created_at", "updated_at"];

export { labels, title, ignoreKeys };
