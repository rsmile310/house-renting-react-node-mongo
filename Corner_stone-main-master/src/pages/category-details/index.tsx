import { Grid } from "@mui/material";
import { useState } from "react";
import StyledCard, { CardProps } from "../../modules/card";
import { GridCard } from "../home/styles";
import { useQuery } from "@tanstack/react-query";
import { getPostCategories } from "../../api/category";
import { useParams } from "react-router-dom";
import SimpleBackdrop from "../../common/backdrop";
import ChatModal from "../../modules/chatModal";
import ShareModal from "../../modules/shareModal";
import MessageModal from "../../modules/messageModal";

const CategoryDetails = () => {
  const [chatModal, setChatModal] = useState<boolean>(false);
  const [shareModal, setShareModal] = useState<boolean>(false);
  const [messageModal, setMessageModal] = useState<boolean>(false);

  const { id } = useParams();

  const { data, isLoading } = useQuery(
    ["category", id],
    () => getPostCategories(id || ""),
    {
      select: (data) => data.data.Post as CardProps[],
    }
  );

  return (
    <Grid container sx={{ padding: 5 }}>
      {data &&
        data.map((val: CardProps, idx: number) => (
          <GridCard item key={idx} xs={12} sm={12} md={3}>
            <StyledCard
              data={val}
              setChatModal={() => setChatModal(true)}
              setMessageModal={() => setMessageModal(true)}
              setShareModal={() => setShareModal(true)}
            />
          </GridCard>
        ))}
      <ChatModal open={chatModal} onClose={() => setChatModal(false)} />
      <ShareModal open={shareModal} onClose={() => setShareModal(false)} />
      {/* <MessageModal
        open={messageModal}
        onClose={() => setMessageModal(false)}
        /> */}
      <SimpleBackdrop open={isLoading} />
    </Grid>
  );
};

export default CategoryDetails;
