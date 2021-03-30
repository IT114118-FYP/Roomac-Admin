import usePermission from "../navigation/usePermission";

const { permissionReady, permissions, getPermission } = usePermission();

{
  permissionReady && (
    <>
      <List>
        {getPermission(TAG.CRUD.READ + TAG.routes.branches) && (
          <DrawerItem title="Branches" path={routes.branches.MANAGE}>
            <BusinessIcon />
          </DrawerItem>
        )}
      </List>
    </>
  );
}
