const title = "Branches";
const editTag = "editBranch";
const deleteTag = "deleteBranch";

const labels = [
	{
		id: "id",
		label: "Branch ID",
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
		id: "created_at",
		label: "Created At",
	},
	{
		id: "updated_at",
		label: "updated At",
	},
];

const ignoreKeys = ["created_at", "updated_at"];

export { labels, title, editTag, deleteTag, ignoreKeys };
